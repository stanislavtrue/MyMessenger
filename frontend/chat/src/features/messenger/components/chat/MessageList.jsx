import { useRef } from "react";
import { MESSAGE_CONTEXT_MENU } from "../../constants/messageMenuItems";
import { useMessengerContext } from "../../context/MessengerContext";
import { useAutoScroll } from "../../hooks/chat/useAutoScroll";
import { useMessageSearchNavigation } from "../../hooks/chat/useMessageSearchNavigation";
import { useReadMessages } from "../../hooks/chat/useReadMessages";
import { formatDividerDate } from "../../utils/formatDividerDate";
import { ContextMenuWrapper } from "../common/ContextMenuWrapper";
import { MessageBubble } from "./messageBubble/MessageBubble";
import { MessageItem } from "./MessageItem";

export const MessageList = ({ messages }) => {
    const messengerContext = useMessengerContext();
    const { 
        contextMenu, showMenu, closeMenu, openReply, chatSearchText, filteredSearchMessages, 
        currentSearchIndex, highlightMsgId, triggerHighlight, markAsRead, selectedChatId
    } = messengerContext;

    useMessageSearchNavigation(chatSearchText, filteredSearchMessages, currentSearchIndex, triggerHighlight);
    const bottomRef = useAutoScroll([messages.length]);

    const messagesContainerRef = useRef();

    useReadMessages(messages, selectedChatId, messagesContainerRef, markAsRead);

    const handleQuickReply = (message) => {
        openReply(message);
        document.getElementById("message-input")?.focus();
    };
    
    return (
        <div className="relative flex flex-col w-full flex-1">
            <div ref={messagesContainerRef} className="w-full flex flex-col mt-auto! justify-end">

                {messages.map((message, index) => {
                    const previousMessage = messages[index - 1];
                    const nextMessage = messages[index + 1];

                    const showDivider = !previousMessage || previousMessage.date !== message.date;

                    const isFirstMessage = 
                        !previousMessage ||
                        previousMessage.isOwnMessage !== message.isOwnMessage ||
                        showDivider;

                    const isLastMessage =
                        !nextMessage ||
                        nextMessage.isOwnMessage !== message.isOwnMessage ||
                        nextMessage.date !== message.date;
                        
                    const isTargetMessage = contextMenu.visible && contextMenu.type === "message" && contextMenu.messageData?.id === message.id;
                    const isHighlighted = isTargetMessage || highlightMsgId === message.id;

                    const spacingClass = isLastMessage ? "mb-3!" : "mb-1.5!";

                    return (
                        <MessageItem 
                            key={message.id || index}
                            message={message}
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
                        const Icon = item.icon;
                        const currentLabel = item.label(contextMenu.messageData, messengerContext);

                        return (
                            <button
                                key={item.id}
                                onClick={async () => {
                                    if (contextMenu.messageData) {
                                        await item.action(contextMenu.messageData, messengerContext);
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
        </div>
    );
};
