import { formatDividerDate } from "../utils/formatDividerDate";
import { MessageBubble } from "./MessageBubble";
import { useMessengerContext } from "../context/MessengerContext";
import { ContextMenuWrapper } from "./ContextMenuWrapper";
import { useMessageSearchNavigation } from "../hooks/useMessageSearchNavigation";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { MESSAGE_CONTEXT_MENU } from "../constants/messageMenuItems";

export const MessageList = ({ messages}) => {
    const messengerContext = useMessengerContext();
    const { 
        contextMenu, showMenu, closeMenu, openReply, chatSearchText, 
        filteredSearchMessages, currentSearchIndex, highlightMsgId, triggerHighlight
    } = messengerContext;

    useMessageSearchNavigation(chatSearchText, filteredSearchMessages, currentSearchIndex, triggerHighlight);
    const bottomRef = useAutoScroll([messages.length]);

    const handleQuickReply = (message) => {
        openReply(message);
        document.getElementById("message-input")?.focus();
    }
    
    return (
        <div className="relative flex flex-col w-full flex-1">
            {contextMenu.visible && contextMenu.type === "message" && (
                <div onClick={closeMenu} className="fixed inset-0 z-40"/>
            )}

            <div className="w-full flex flex-col mt-auto! justify-end">

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
                    const isHighlighed = isTargetMessage || highlightMsgId === message.id;

                    const spacingClass = isLastMessage ? "mb-3!" : "mb-1.5!";

                    return (
                        <div 
                            key={message.id || index} 
                            id={`msg-${message.id}`}
                            className="w-full flex flex-col">

                            {showDivider && (
                                <div className="flex justify-center my-4! select-none pointer-events-none">
                                    <div className="px-2! py-1! bg-[#D236E0]/20 text-sm! font-semibold! rounded-2xl">
                                        {formatDividerDate(message.date)}
                                    </div>
                                </div>
                            )}

                            <div 
                                onDoubleClick={() => handleQuickReply(message)} 
                                className={`
                                    w-full flex items-center 
                                    transition-colors duration-300 ease-in-out
                                    message-row-highlight ${spacingClass} 
                                    ${isHighlighed ? "active" : ""}`}
                            >
                                <div className="w-full max-w-180 px-4! mx-auto!">

                                    <div 
                                        onContextMenu={(e) => showMenu(e, message, "message")}
                                        className="w-full flex flex-col"
                                    >
                                        <MessageBubble
                                            message={message}
                                            isFirstMessage={isFirstMessage}
                                            isLastMessage={isLastMessage}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                        ? "text-red-500! hover:bg-[#282836]/60! hover:text-white!"
                                        : "text-white hover:bg-[#282836]/60!"
                                    }    
                                `}
                            >
                                <Icon size={18} className={item.isDanger ? "" : "text-[#7F88C0]"} />
                                <span>{currentLabel}</span>
                            </button>
                        );
                    })}
                </ContextMenuWrapper>
        </div>
    );
};
