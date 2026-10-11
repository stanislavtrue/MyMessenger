import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { MESSAGE_CONTEXT_MENU } from "../../constants/messageMenuItems";
import { useMessengerContext } from "../../context/MessengerContext";
import { useAutoScroll } from "../../hooks/chat/useAutoScroll";
import { useMessageSearchNavigation } from "../../hooks/chat/useMessageSearchNavigation";
import { useReadMessages } from "../../hooks/chat/useReadMessages";
import { ContextMenuWrapper } from "../common/ContextMenuWrapper";
import { MessageItem } from "./MessageItem";
import { DeleteMessageModal } from "../modals/DeleteMessageModal";

export const MessageList = ({ messages, chat, scrollContainerRef, isReadTrackingEnabled }) => {
    const messengerContext = useMessengerContext();
    const { 
        contextMenu, showMenu, closeMenu, openReply, chatSearchText, filteredSearchMessages, 
        currentSearchIndex, highlightMsgId, triggerHighlight, markAsRead, selectedChatId,
        handleDeleteMessageForEveryone, handleDeleteMessageForUser, fetchOlderMessages, 
        isLoadingOlderMessages, hasMoreMessages, bottomRef, scrollToBottom
    } = messengerContext;

    const scrollAnchorRef = useRef(null);
    const previousMessagesRef = useRef(messages);
    const loadingOlderRef = useRef(false);

    const isInitialMount = useRef(true);

    useLayoutEffect(() => {
        const container = scrollContainerRef?.current;
        const anchor = scrollAnchorRef?.current;

        if (container && anchor && anchor.chatId === chat.id) {
            container.scrollTop = anchor.scrollTop + (container.scrollHeight - anchor.scrollHeight);
            scrollAnchorRef.current = null;
        }

        previousMessagesRef.current = messages;
        isInitialMount.current = false;
    }, [messages, chat.id, scrollContainerRef]);

    const handleScroll = useCallback(async () => {
        const container = scrollContainerRef?.current;

        if (isInitialMount.current || loadingOlderRef.current || isLoadingOlderMessages || !container || container.scrollTop > 10) 
            return;

        const page = hasMoreMessages?.[chat.id];
        if (!page?.hasMore || !page?.nextCursor)
            return;

        loadingOlderRef.current = true;

        scrollAnchorRef.current = {
            chatId: chat.id,
            scrollTop: container.scrollTop,
            scrollHeight: container.scrollHeight
        };

        try {
            await fetchOlderMessages(chat.id);
        } catch (error) {
            scrollAnchorRef.current = null;
            console.error("Error loading older messages: ", error);
        } finally {
            loadingOlderRef.current = false;
        }
    }, [scrollContainerRef, hasMoreMessages, fetchOlderMessages, chat.id, isLoadingOlderMessages]);

    useEffect(() => {
        const container = scrollContainerRef?.current;
        if (!container) 
            return;

        container.addEventListener("scroll", handleScroll, { passive: true });
        
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [scrollContainerRef, handleScroll]);

    useEffect(() => {
        isInitialMount.current = true;

        const timer = setTimeout(() => {
            scrollToBottom("auto");
        }, 0);

        return () => clearTimeout(timer);
    }, [chat.id]);

    const [deletingMessage, setDeletingMessage] = useState(null);

    useMessageSearchNavigation(chatSearchText, filteredSearchMessages, currentSearchIndex, triggerHighlight);
    const messagesContainerRef = useRef();

    useReadMessages(messages, selectedChatId, messagesContainerRef, markAsRead, isReadTrackingEnabled);

    const handleQuickReply = (message) => {
        openReply(message);
        document.getElementById("message-input")?.focus();
    };

    const handleConfirmDelete = async (forEveryone) => {
        if (!deletingMessage)
            return;

        if (forEveryone) {
            await handleDeleteMessageForEveryone(deletingMessage.id);
        } else {
            await handleDeleteMessageForUser(deletingMessage.id);
        }

        setDeletingMessage(null);
    };

    const pinnedMessageIds = useMemo(() => {
        const pinnedList = chat?.pinnedMessages || [];
        return new Set(pinnedList.map(pm => pm.messageId));
    }, [chat?.pinnedMessages]);

    const enrichedContext = {
        ...messengerContext,
        setDeletingMessage
    };

    const visibleMessages = useMemo(() => {
        return messages.filter(msg => !msg.isDeleted);
    }, [messages]);
    
    return (
        <div className="relative flex flex-col w-full flex-1">
            <div ref={messagesContainerRef} className="w-full flex flex-col mt-auto! justify-end">

                {visibleMessages.map((message, index) => {
                    const previousMessage = visibleMessages[index - 1];
                    const nextMessage = visibleMessages[index + 1];

                    const showDivider = 
                        !previousMessage || 
                        previousMessage.date !== message.date;

                    const isFirstMessage = 
                        !previousMessage ||
                        previousMessage.isOwnMessage !== message.isOwnMessage ||
                        showDivider;

                    const isLastMessage =
                        !nextMessage ||
                        nextMessage.isOwnMessage !== message.isOwnMessage ||
                        nextMessage.date !== message.date;
                        
                    const isTargetMessage = 
                        contextMenu.visible && 
                        contextMenu.type === "message" && 
                        contextMenu.messageData?.id === message.id;

                    const isHighlighted = 
                        isTargetMessage || 
                        highlightMsgId === message.id;

                    const spacingClass = 
                        isLastMessage ? "mb-3!" : "mb-1.5!";

                    const enrichedMessage = {
                        ...message,
                        isPinned: pinnedMessageIds.has(message.id)
                    }

                    const animationDelay = `${Math.min(visibleMessages.length - 1 - index, 20) * 0.015}s`;

                    return (
                        <div 
                            key={message.id || index}
                            className={`${visibleMessages.length - 1 - index < 30 ? "animate-message-scale-up" : ""}`}
                            style={{ animationDelay }}
                        >
                            <MessageItem 
                                key={message.id || index}
                                message={enrichedMessage}
                                isFirstMessage={isFirstMessage}
                                isLastMessage={isLastMessage}
                                isHighlighted={isHighlighted}
                                showDivider={showDivider}
                                showMenu={showMenu}
                                handleQuickReply={handleQuickReply}
                                spacingClass={spacingClass}
                            />
                        </div>
                    );
                })}
            
                <div ref={bottomRef} />

            </div>

            <ContextMenuWrapper type="message">
                {MESSAGE_CONTEXT_MENU.map((item) => {
                    const Icon = item.icon(contextMenu.messageData);
                    const currentLabel = item.label(contextMenu.messageData, enrichedContext);

                    return (
                        <button
                            key={item.id}
                            onClick={async () => {
                                if (contextMenu.messageData) {
                                    await item.action(contextMenu.messageData, enrichedContext);
                                }
                                closeMenu();
                            }}
                            className={`
                                flex items-center gap-5 px-3! py-1.5! text-sm! font-semibold! rounded-2xl
                                cursor-pointer transition-colors duration-0 w-full text-left
                                ${item.isDanger
                                    ? "text-red-500! hover:bg-[#212121]! hover:text-white!"
                                    : "text-white hover:bg-[#212121]!"
                                }    
                            `}
                        >
                            <Icon size={18} strokeWidth={item.strokeWidth || 0} className={item.isDanger ? "" : "text-[#959595]"} />
                            <span>{currentLabel}</span>
                        </button>
                    );
                })}
            </ContextMenuWrapper>

            <DeleteMessageModal 
                isOpen={Boolean(deletingMessage)}
                onClose={() => setDeletingMessage(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};
