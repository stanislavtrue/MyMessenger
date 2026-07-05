import { Avatar } from "./Avatar";

export const MiniContactItem = ({ chat, onSelect }) => {
    return (
        <div
            onClick={onSelect}
            className="
                relative flex items-center justify-center cursor-pointer shrink-0
                rounded-3xl overflow-hidden bg-[#282836]/50 hover:text-[#B06EE4]
                transition-colors duration-100
            "
        >
            <Avatar 
                size="size-8"
                name={chat.user.displayName}
                avatar={chat.user.avatar}
            />
            <span className="font-semibold! px-3!">
                {chat.user.displayName}
            </span>
        </div>
    );
}
