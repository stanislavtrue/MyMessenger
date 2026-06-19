import { EllipsisVertical, Plus, Settings } from "lucide-react";
import { useRef } from "react";
import { BsPeople, BsPerson, BsChevronRight } from "react-icons/bs";
import { PiBookmarkSimple } from "react-icons/pi";

export const SidebarMenu = ({ isOpen, menuRef }) => {
    return (
        <div 
            style={{ fontFamily: "Roboto" }}
            ref={menuRef}
            className={`
                absolute z-50
                top-13 left-2
                w-55 h-fit
                rounded-xl
                bg-[#272739]/80
                backdrop-blur-xs
                shadow-black/60
                shadow-lg
                font-semibold!
                text-[#FFFFFF]/90
                origin-top-left

                transition-all duration-100 ease-out

                ${isOpen
                    ? "opacity-100 translate-x-1 translate-y-1 scale-100"
                    : "opacity-0 -translate-x-1 -translate-y-1 scale-80 pointer-events-none"
                }    
            `}
        >
            <div className="
                flex items-center gap-4
                px-3! py-1! mx-1! my-1!
                rounded-md hover:bg-[#131319]/80
                cursor-pointer transition-colors duration-0
            ">
                <div className="size-5.5 bg-white rounded-full" />
                <span className="text-sm!">User</span>

            </div>

            <div className="h-px! w-full bg-[#52526B] my-1!" />

            <div className="
                flex items-center gap-4
                px-3! py-1! mx-1! my-1!
                rounded-lg hover:bg-[#131319]/80
                cursor-pointer transition-colors duration-0
            ">
                <Plus size={22} className="text-[#8888BA]" />
                <span className="text-sm!">Add Account</span>

            </div>

            <div className="h-px! w-full bg-[#52526B] my-1!" />
                        
            <div className="
                flex items-center gap-4.5
                px-3! py-1.5! mx-1! my-1!
                rounded-lg hover:bg-[#131319]/80
                cursor-pointer transition-colors duration-0
            ">
                <BsPerson size={20} className="text-[#8888BA]" />
                <span className="text-sm!">My Profile</span>

            </div>

            <div className="
                flex items-center gap-4.5
                px-3! py-1.5! mx-1! my-1!
                rounded-lg hover:bg-[#131319]/80
                cursor-pointer transition-colors duration-0
            ">
                <PiBookmarkSimple size={20} className="text-[#8888BA]" />
                <span className="text-sm!">Saved Messages</span>

            </div>

            <div className="
                flex items-center gap-4.5
                px-3! py-1.5! mx-1! my-1!
                rounded-lg hover:bg-[#131319]/80
                cursor-pointer transition-colors duration-0
            ">
                <BsPeople size={20} className="text-[#8888BA]" />
                <span className="text-sm!">Contacts</span>

            </div>

            <div className="
                flex items-center gap-4.5
                px-3! py-1.5! mx-1! my-1!
                rounded-lg hover:bg-[#131319]/80
                cursor-pointer transition-colors duration-0
            ">
                <Settings size={20} className="text-[#8888BA]" />
                <span className="text-sm!">Settings</span>

            </div>
                        
            <div className="
                flex items-center gap-4.5
                px-3! py-1.5! mx-1! my-1!
                rounded-lg hover:bg-[#131319]/80
                cursor-pointer transition-colors duration-0
            ">
                <EllipsisVertical size={20} className="text-[#8888BA]" />
                <span className="text-sm!">More</span>
                <BsChevronRight size={15} className="text-[#8888BA] ml-20!" />
            </div>         
        </div>
    );
}
