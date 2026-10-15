import { memo } from "react";
import { MessageBubble } from "./messageBubble/MessageBubble";

export const MessageItem = memo(function MessageItem({ message, isFirstMessage, isLastMessage, isHighlighted, showMenu, handleQuickReply, spacingClass }) {
    const isDeleted = message.isDeleted;

    return (
        <div 
            id={`msg-${message.id}`}
            className="w-full flex flex-col"
        >
            {!isDeleted && (
                <div 
                    onDoubleClick={() => handleQuickReply(message)} 
                    className={`
                        w-full flex items-center 
                        transition-colors duration-500 ease-in
                        message-row-highlight ${spacingClass} 
                        ${isHighlighted ? "active" : ""}`}
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
            )}
        </div>
    );
});
