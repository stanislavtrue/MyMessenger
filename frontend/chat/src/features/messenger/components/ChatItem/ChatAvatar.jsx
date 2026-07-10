import { Avatar } from "../Avatar";

export const ChatAvatar = ({ user, isSelected }) => {
    const showStatus = user.status === "online" || user.status === "typing";

    return (
        <div className="
            relative w-14 h-14 rounded-full text-white text-2xl! z-10
            bg-linear-to-b from-[#D95353] to-[#732C2C] shrink-0
            flex items-center justify-center
        ">
            {showStatus && (
                <div className={`
                    absolute w-3.5 h-3.5 rounded-full bottom-0 right-1 border-2! 
                    ${isSelected 
                        ? "bg-white border-[#6F4F9C]!"
                        : "bg-[#0AC630] border-[#1F1F28]!"
                    }
                `}/>
            )}
            <Avatar 
                avatar={user.avatar}
                name={user.displayName}
            />
        </div>
    );
};
