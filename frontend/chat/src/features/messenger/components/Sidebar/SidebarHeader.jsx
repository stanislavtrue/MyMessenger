import { ArrowLeft } from "lucide-react";
import { TfiMenu } from "react-icons/tfi";
import { SidebarMenu } from "./SidebarMenu";
import { SlMagnifier } from "react-icons/sl";
import { useMessengerContext } from "../../context/MessengerContext";

export const SidebarHeader = ({ menuRef, buttonRef, inputRef }) => {
    const { 
        isSidebarMenuOpen, setIsSidebarMenuOpen, closeSidebarSearch, 
        setIsContactsMode, isSidebarSearchFocused, isContactsMode, 
        sidebarSearchText, setSidebarSearchText, setIsSidebarSearchFocused
    } = useMessengerContext();

    const isSearchMode = isSidebarSearchFocused || isContactsMode;
    
    const placeholderText = isContactsMode ? "Search contacts" : "Search";

    return (
        <div className="mx-4! pt-2! pb-3! text-center">
            <div className="flex items-center relative">
                <div 
                    ref={buttonRef} 
                    onClick={() => {
                        if (isSearchMode) {
                            closeSidebarSearch();
                        } else {
                            setIsSidebarMenuOpen(!isSidebarMenuOpen);
                        }
                    }}
                    className="
                        relative flex items-center justify-center 
                        h-11 w-11 rounded-full hover:bg-[#282836]
                        active:scale-90 active:bg-[#52526B]
                        transition-all duration-300
                        cursor-pointer overflow-hidden
                    "
                >
                    <TfiMenu
                        size={22}
                        className={`
                            absolute text-white transition-all duration-300
                            ${isSearchMode
                                ? "opacity-0 rotate-180 scale-50"
                                : "opacity-100 rotate-0 scale-100"
                            }
                        `}
                    />

                    <ArrowLeft
                        size={26}
                        className={`
                            absolute text-white transition-all duration-300    
                            ${isSearchMode
                                ? "opacity-100 rotate-0 scale-100"
                                : "opacity-0 -rotate-180 scale-50"
                            }
                        `}
                    />
                </div>

                <SidebarMenu
                    isOpen={isSidebarMenuOpen} 
                    menuRef={menuRef} 
                    onContactsClick={() => {
                        setIsContactsMode(true);
                        setIsSidebarMenuOpen(false);
                    }} 
                />

                <div className="
                    w-full! flex flex-1 items-center group 
                    bg-[#111111] transition-all duration-200 rounded-3xl ml-3! pl-4!
                    focus-within:bg-[#1F1F28]
                    hover:ring-[1.5px] hover:ring-[#7F88C0]/50 
                    focus-within:ring-2 focus-within:ring-[#8F5EB5]
                    focus-within:hover:ring-2 focus-within:hover:ring-[#8F5EB5]
                ">
                    <SlMagnifier size={18} strokeWidth={50} className="text-[#7F88C0] transition-colors duration-200 group-focus-within:text-[#8F5EB5]" />

                    <input
                        ref={inputRef}
                        value={sidebarSearchText}
                        onChange={(e) => setSidebarSearchText(e.target.value)}
                        onFocus={() => setIsSidebarSearchFocused(true)}
                        className="
                            w-full h-10! pl-3! rounded-3xl text-white 
                            outline-none! placeholder:text-[#7F88C0]!
                        "
                        type="text"
                        placeholder={placeholderText}
                    />
                </div>
            </div>
        </div>
    );
};
