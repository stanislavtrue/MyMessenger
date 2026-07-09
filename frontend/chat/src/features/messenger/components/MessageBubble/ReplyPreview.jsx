import { useReplyScroll } from "../../hooks/useReplyScroll"

export const ReplyPreview = ({ message }) => {
    const { ripples, handleReplyClick } = useReplyScroll(message);

    if (!message.replyTo) return null;

    return (
        <div 
            onClick={handleReplyClick}
            className={`
                relative overflow-hidden flex flex-col my-1! justify-between h-10 w-full text-sm! rounded-sm cursor-pointer select-none
                ${message.isOwnMessage
                    ? "bg-white/10 border-white! border-l-4! hover:bg-white/5"
                    : "bg-[#8F5EB5]/20 border-[#8F5EB5]! border-l-4! hover:bg-[#8F5EB5]/15"
                }
            `}
        >
            {ripples.map((ripple) => (
                <span 
                    key={ripple.id}
                    className="animate-ripple"
                    style={{
                        top: ripple.y,
                        left: ripple.x,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                />
            ))}
            <span className="px-2!">
                {message.replyTo.senderName}
            </span>
            <span className="px-2! truncate min-w-40">
                {message.replyTo.text}
            </span>
        </div>
    );
};
