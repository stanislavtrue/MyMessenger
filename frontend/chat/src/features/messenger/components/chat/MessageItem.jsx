import { memo } from "react";
import { formatDividerDate } from "../../utils/formatDividerDate";
import { MessageBubble } from "./messageBubble/MessageBubble";

export const MessageItem = memo(({ message, isFirstMessage, isLastMessage, isHighlighted, showDivider, showMenu, handleQuickReply, spacingClass }) => {
    return (
        <div 
            id={`msg-${message.id}`}
            data-message-id={message.id}
            data-is-own={message.isOwnMessage}
            className="w-full flex flex-col"
        >
            {showDivider && (
                <div className="flex justify-center my-4! select-none pointer-events-none">
                    <div className="px-2! py-1! bg-[#006FC3]/40 text-sm! font-semibold! rounded-2xl">
                        {formatDividerDate(message.date)}
                    </div>
                </div>
            )}

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
        </div>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.message === nextProps.message &&
        prevProps.isHighlighted === nextProps.isHighlighted &&
        prevProps.isFirstMessage === nextProps.isFirstMessage &&
        prevProps.isLastMessage === nextProps.isLastMessage &&
        prevProps.showDivider === nextProps.showDivider
    );
});
