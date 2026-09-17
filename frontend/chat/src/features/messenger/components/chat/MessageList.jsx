import { useMemo, useRef, useState } from "react";
import { MESSAGE_CONTEXT_MENU } from "../../constants/messageMenuItems";
import { useMessengerContext } from "../../context/MessengerContext";
import { useAutoScroll } from "../../hooks/chat/useAutoScroll";
import { useMessageSearchNavigation } from "../../hooks/chat/useMessageSearchNavigation";
import { useReadMessages } from "../../hooks/chat/useReadMessages";
import { ContextMenuWrapper } from "../common/ContextMenuWrapper";
import { MessageItem } from "./MessageItem";
import { DeleteMessageModal } from "../modals/DeleteMessageModal";

export const MessageList = ({ messages, chat }) => {
    const messengerContext = useMessengerContext();
    const { 
        contextMenu, showMenu, closeMenu, openReply, chatSearchText, filteredSearchMessages, 
        currentSearchIndex, highlightMsgId, triggerHighlight, markAsRead, selectedChatId,
        handleDeleteMessageForEveryone, handleDeleteMessageForUser
    } = messengerContext;

    const [deletingMessage, setDeletingMessage] = useState(null);

    useMessageSearchNavigation(chatSearchText, filteredSearchMessages, currentSearchIndex, triggerHighlight);
    const bottomRef = useAutoScroll([messages.length]);
    const messagesContainerRef = useRef();

    useReadMessages(messages, selectedChatId, messagesContainerRef, markAsRead);

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

                    return (
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
