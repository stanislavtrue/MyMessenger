import { Avatar } from "../../common/Avatar";

export const ChatAvatar = ({ user, isSelected }) => {
    const showStatus = user.status === "online" || user.status === "typing";

    return (
        <div className="relative inline-flex shrink-0">
            <Avatar
                avatar={user?.avatar}
                name={user?.displayName || user?.username || "User"}
                size="size-14"
            />

            {showStatus && (
                <div className={`
                    absolute w-3.5 h-3.5 rounded-full bottom-0 right-1 border-2! 
                    ${isSelected 
                        ? "bg-white border-[#6F4F9C]!"
                        : "bg-[#0AC630] border-[#1F1F28]!"
                    }
                `}/>
            )}
        </div>
    );
};
