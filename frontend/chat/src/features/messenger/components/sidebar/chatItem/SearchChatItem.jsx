import { Avatar } from "../../common/Avatar";

export const SearchChatItem = ({ chat, onSelect }) => {
    return (
        <div
            onClick={onSelect}
            className="
                relative flex items-center justify-center cursor-pointer shrink-0
                rounded-3xl overflow-hidden bg-[#527AFF]/10 hover:text-[#527AFF]
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
