import { useEffect, useRef, useState } from "react";
import { ChatItem } from "./ChatItem"
import { Search, Menu, User, Settings } from "lucide-react";

export const Sidebar = ({ chats, selectedChatId, setSelectedChatId }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target))
            {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    return (
        <div className="w-1/3 h-screen border-r! border-[#282836]! bg-[#1F1F28]">

            <div className="
                pl-4! pr-2! pt-1! pb-3! 
                text-center 
                select-none
            ">
                <div className="flex items-center relative">

                    <div 
                        ref={buttonRef} 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`
                            flex items-center justify-center 
                            h-10 w-12
                            rounded-full 
                            hover:bg-[#282836]
                            active:scale-90
                            active:bg-[#52526B]
                            transition-all duration-300
                             
                            ${isMenuOpen
                                ? "bg-[#282836]"
                                : ""
                            }
                        `}
                    >
                        <Menu 
                            size={22} 
                            className="cursor-pointer" 
                        />
                    </div>

                    <div
                        ref={menuRef}
                        className={`
                            absolute
                            top-13 left-2
                            w-50 h-60
                            rounded-2xl
                            bg-[#272739]/80
                            backdrop-blur-xs
                            shadow-[#000000]
                            shadow-lg
                            p-1!
                            origin-top-left

                            transition-all duration-100 ease-out

                            ${isMenuOpen
                                ? "opacity-100 translate-x-1 translate-y-1 scale-100"
                                : "opacity-0 -translate-x-1 -translate-y-1 pointer-events-none"
                            }
                        `}
                    >
                        <div className="
                                flex items-center gap-4
                                px-2! py-1!
                                rounded-lg
                                hover:bg-[#1F1F27]/70
                                cursor-pointer
                                transition-colors
                            "
                        >
                            <User size={20} />
                            <span className="text-sm!">User</span>

                        </div>

                        <div className="h-px! w-full bg-[#52526B] my-1!" />

                        <div className="
                                flex items-center gap-4
                                px-2! py-1!
                                rounded-lg
                                hover:bg-[#1F1F27]/70
                                cursor-pointer
                                transition-colors
                            "
                        >
                            <Settings size={20} />
                            <span className="text-sm!">Settings</span>

                        </div>
                    
                </div>

                    <div className="w-full! flex items-center group focus-within:ring-2 focus-within:ring-[#957AAA] bg-[#16161D] transition-all duration-300 rounded-3xl ml-4! pl-4!">

                        <Search size={22} className="text-[#52526B] transition-colors group-focus-within:text-[#957AAA]" />

                        <input
                            className="
                                w-full h-11!
                                rounded-3xl 
                                py-2! pl-5!
                                text-white 
                                outline-none!
                            "
                            type="text"
                            placeholder="Search"
                            border="none"
                            _placeholder={{
                                color: "#52526B"
                            }}
                        />

                    </div>

                </div>

            </div>

            <div className="flex flex-col overflow-y-auto">
                {chats.map((chat) => (
                    <ChatItem 
                        key={chat.id} 
                        chat={chat} 
                        setSelectedChatId={setSelectedChatId}
                        selectedChatId={selectedChatId}
                    />
                        
                ))}
            </div>

        </div>
    );
}
