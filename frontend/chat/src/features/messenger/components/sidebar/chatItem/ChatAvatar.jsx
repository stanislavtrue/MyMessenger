import { Avatar } from "../../common/Avatar";

export const ChatAvatar = ({ user, isSelected }) => {
    return (
        <div className="relative inline-flex shrink-0">
            <Avatar
                avatar={user?.avatar}
                name={user?.displayName || user?.username || "User"}
                size="size-14"
            />

            <div className={`
                absolute w-3.5 h-3.5 rounded-full bottom-0 right-1 border-2!
                transition-all duration-300
                ${isSelected 
                    ? "bg-white border-[#6F4F9C]!"
                    : "bg-[#0AC630] border-[#1F1F28]!"
                }
                ${user.isOnline
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-0 pointer-events-none"
                }
            `}/>
        </div>
    );
};
