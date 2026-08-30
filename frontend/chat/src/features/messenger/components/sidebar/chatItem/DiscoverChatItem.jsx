import { Avatar } from "../../common/Avatar";

export const DiscoverChatItem = ({ chat, isSelected, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(chat.id)}
            className={`
                relative flex flex-col items-center gap-2 cursor-pointer shrink-0
                w-20 select-none overflow-hidden rounded-2xl px-2! py-3!
                ${isSelected
                    ? "bg-[#527AFF]"
                    : "hover:bg-[#282828]"
                }
            `}
        >
            <Avatar
                size="size-14"
                name={chat.user.displayName}
                avatar={chat.user.avatar}
            />
            <span className="text-xs! text-white truncate w-full text-center">
                {chat.user.displayName}
            </span>
        </div>
    );
}
