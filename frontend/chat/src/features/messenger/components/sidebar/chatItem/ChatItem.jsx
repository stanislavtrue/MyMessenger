import { useRipple } from "@/hooks/useRipple";
import { ChatAvatar } from "./ChatAvatar";
import { ChatPreview } from "./ChatPreview";
import { ChatMeta } from "./ChatMeta";

export const ChatItem = ({ chat, lastMessageText, lastMessageTime, lastMessageDate, selectedChatId, setSelectedChatId, isContextActive, onContextMenu }) => {
    const { ripples, createRipple } = useRipple();
    const isSelected = selectedChatId === chat.id;
    const unreadCount = chat.unreadCount || 0;

    const handleClick = (e) => {
        createRipple(e);

        setTimeout(() => {
            setSelectedChatId(chat.id);
        }, 80);
    };

    return (
        <div 
            onClick={handleClick}
            onContextMenu={onContextMenu}
            className={`
                relative flex items-center gap-2 px-2! py-2!
                w-[97%] rounded-2xl m-auto! select-none overflow-hidden
                transition-colors duration-0 cursor-pointer
                ${isSelected ? "bg-[#5D25AA]" : "hover:bg-[#282836]/50"}
                ${isContextActive && !isSelected ? "bg-[#282836]" : ""}
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

            <ChatAvatar user={chat.user} isSelected={isSelected} />

            <ChatPreview user={chat.user} lastMessageText={lastMessageText} isSelected={isSelected} />

            <ChatMeta lastMessageDate={lastMessageDate} lastMessageTime={lastMessageTime} unreadCount={unreadCount} isSelected={isSelected} />
        </div>
    );
};
