import { Avatar } from "../../common/Avatar";

export const ActiveReactionBadge = ({ reaction, user, isOwnMessage, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className={`
                z-10 w-fit gap-1 px-2! py-0.5! 
                flex justify-center items-center rounded-full 
                text-lg! select-none cursor-pointer shrink-0
                ${isOwnMessage 
                    ? "bg-white/80 hover:bg-white/70" 
                    : "bg-[#885dcc] hover:bg-[#905adb]"
                }   
            `}
        >
            <span>{reaction}</span>
            <Avatar
                size="size-6"
                avatar={user.avatar}
                name={user.displayName}
            />
        </div>
    );
}
