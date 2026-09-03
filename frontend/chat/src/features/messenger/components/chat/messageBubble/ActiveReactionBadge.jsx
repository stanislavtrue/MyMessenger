import { Avatar } from "../../common/Avatar";

export const ActiveReactionBadge = ({ reaction, currentUser, companion, count, isOwnReaction, isOwnMessage, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className={`
                relative z-10 w-fit px-2! py-0.5! gap-1
                flex justify-center items-center rounded-full 
                text-lg! select-none cursor-pointer shrink-0
                transition-all duration-300 ease-in
                ${isOwnMessage && isOwnReaction ? "bg-white/90 hover:bg-white/80 text-black!" : ""} 
                ${!isOwnMessage && isOwnReaction ? "bg-[#527AFF] hover:bg-[#3d69fd] text-white!" : ""}
                ${!isOwnMessage && !isOwnReaction ? "bg-white/30 hover:bg-white/20 text-white!" : ""}  
                ${isOwnMessage && !isOwnReaction ? "bg-[#527AFF]/30 hover:bg-[#3d69fd]/30 text-white!" : ""}
            `}
        >
            <span className="reaction-set">{reaction}</span>
            {count === 1 && 
                <Avatar
                    size="size-6"
                    avatar={isOwnReaction ? currentUser?.avatar : companion?.avatar}
                    name={isOwnReaction ? currentUser?.displayName : companion?.displayName}
                />
            }
            {count === 2 &&
                <div className="flex items-center -space-x-3!">
                    <Avatar 
                        size="size-6"
                        avatar={currentUser?.avatar}
                        name={currentUser?.displayName}
                    />
                    <div className="reaction-set">
                        <Avatar 
                            size="size-6"
                            avatar={companion?.avatar}
                            name={companion?.displayName}
                        />
                    </div>
                </div>
            }
            {count > 2 &&
                <span className="font-semibold! px-1!">{count}</span>
            }
        </div>
    );
}
