import { EllipsisVertical, Plus, Settings } from "lucide-react";
import { BsPeople, BsPerson, BsChevronRight } from "react-icons/bs";
import { PiBookmarkSimple } from "react-icons/pi";
import { useMessengerContext } from "../../context/MessengerContext";
import { Avatar } from "../common/Avatar";
import { useDelayedUnmount } from "../../hooks/useDelayedUnmount";

export const SidebarMenu = ({ isOpen, menuRef, onContactsClick }) => {
    const { currentUser } = useMessengerContext();
    const { shouldRender, animState } = useDelayedUnmount(isOpen);

    if (!shouldRender) return null;

    const isOpenState = animState === "open";

    return (
        <div 
            ref={menuRef}
            className={`
                absolute z-50 top-13 left-2 w-46 h-fit
                rounded-2xl bg-[#1C1C1C] backdrop-blur-xs
                shadow-black/60 shadow-lg
                font-semibold! text-[#FFFFFF]/90 origin-top-left
                transition-all duration-150

                ${isOpenState
                    ? "opacity-100 translate-x-1 translate-y-1 scale-100 pointer-events-auto"
                    : "opacity-0 -translate-x-1 -translate-y-1 scale-80 pointer-events-none"
                }    
            `}
        >
            <div className="
                flex items-center gap-4
                px-3! py-1! mx-1! my-1!
                rounded-2xl hover:bg-[#212121]
                cursor-pointer transition-colors duration-0
            ">
                <Avatar
                    size="size-5.5"
                    avatar={currentUser.avatar}
                    name={currentUser.displayName}
                />
                <span className="text-sm!">{currentUser.displayName}</span>

            </div>

            <div className="h-px! w-full bg-[#52526B] my-1!" />

            <div className="
                flex items-center gap-4
                px-3! py-1! mx-1! my-1!
                rounded-2xl hover:bg-[#212121]
                cursor-pointer transition-colors duration-0
            ">
                <Plus size={22} className="text-[#959595]" />
                <span className="text-sm!">Add Account</span>

            </div>

            <div className="h-px! w-full bg-[#52526B] my-1!" />
                        
            <div className="
                flex items-center gap-4.5
                px-3! py-1.5! mx-1! my-1!
                rounded-2xl hover:bg-[#212121]
                cursor-pointer transition-colors duration-0
            ">
                <BsPerson size={20} className="text-[#959595]" />
                <span className="text-sm!">My Profile</span>

            </div>

            <div className="
                flex items-center gap-4.5
                px-3! py-1.5! mx-1! my-1!
                rounded-2xl hover:bg-[#212121]
                cursor-pointer transition-colors duration-0
            ">
                <PiBookmarkSimple size={20} className="text-[#959595]" />
                <span className="text-sm!">Saved Messages</span>

            </div>

            <div 
                onClick={onContactsClick}
                className="
                    flex items-center gap-4.5
                    px-3! py-1.5! mx-1! my-1!
                    rounded-2xl hover:bg-[#212121]
                    cursor-pointer transition-colors duration-0
                "
            >
                <BsPeople size={20} className="text-[#959595]" />
                <span className="text-sm!">Contacts</span>

            </div>

            <div className="
                flex items-center gap-4.5
                px-3! py-1.5! mx-1! my-1!
                rounded-2xl hover:bg-[#212121]
                cursor-pointer transition-colors duration-0
            ">
                <Settings size={20} className="text-[#959595]" />
                <span className="text-sm!">Settings</span>

            </div>
                        
            <div className="
                flex items-center gap-4.5
                px-3! py-1.5! mx-1! my-1!
                rounded-2xl hover:bg-[#212121]
                cursor-pointer transition-colors duration-0
            ">
                <EllipsisVertical size={20} className="text-[#959595] shrink-0" />
                <span className="text-sm!">More</span>
                <BsChevronRight size={15} className="text-[#959595] ml-14! shrink-0" />
            </div>         
        </div>
    );
}
