import { sortChats} from "../utils/sortChats";
import { useEffect, useRef, useState } from "react";
import { ChatItem } from "./ChatItem"
import { Search, Menu, User, Settings, ArrowLeft } from "lucide-react";

export const Sidebar = ({ sidebarWidth, setSidebarWidth, chats, isMobile, selectedChatId, setSelectedChatId }) => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const [searchText, setSearchText] = useState("");

    const sortedChats = useMemo (() => sortChats(chats), [chats]);

    const filteredChats = useMemo(() => sortedChats.filter(chat => 
        chat.name.toLowerCase().includes(searchText.toLowerCase())), [sortedChats, searchText]
    );

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);

        setIsSearchFocused(false);
        setSearchText("");
    }

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
        <div 
            style={{
                width: isMobile ? "100%" : `${sidebarWidth}%`,
                minWidth: isMobile ? "100%" : "240px",
                maxWidth: isMobile ? "100%" : "650px"
            }}
            className="relative h-screen w-full flex flex-col border-r! border-[#282836]! bg-[#1F1F28] select-none shrink-0">

            <div className="
                pl-4! pr-4! pt-1! pb-3! 
                text-center 
            ">
                <div className="flex items-center relative">

                    <div 
                        ref={buttonRef} 
                        onClick={() => {
                            if (isSearchFocused) {
                                setIsSearchFocused(false)
                                setSearchText("")
                            } else {
                                setIsMenuOpen(!isMenuOpen);
                            }
                        }}
                        className="
                            relative
                            flex items-center justify-center 
                            h-10 w-12
                            rounded-full 
                            hover:bg-[#282836]
                            active:scale-90
                            active:bg-[#52526B]
                            transition-all duration-300
                            cursor-pointer
                            overflow-hidden
                        "
                    >
                        <Menu 
                            size={22}
                            className={`
                                absolute
                                transition-all duration-300
                                text-[#707099]
                                
                                ${isSearchFocused
                                    ? "opacity-0 rotate-180 scale-50"
                                    : "opacity-100 rotate-0 scale-100"
                                }
                            `}
                        />

                        <ArrowLeft
                            size={22}
                            className={`
                                absolute
                                transition-all duration-300    
                                text-[#707099]

                                ${isSearchFocused
                                    ? "opacity-100 rotate-0 scale-100"
                                    : "opacity-0 -rotate-180 scale-50"
                                }
                            `}
                        />
                    </div>

                    <div
                        ref={menuRef}
                        className={`
                            absolute z-50
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
                            <Settings size={20} className="text-[#707099]" />
                            <span className="text-sm!">Settings</span>

                        </div>
                    
                </div>

                    <div className="w-full! flex items-center group focus-within:ring-2 focus-within:ring-[#957AAA] bg-[#16161D] transition-all duration-300 rounded-3xl ml-4! pl-4!">

                        <Search size={22} className="text-[#52526B] transition-colors group-focus-within:text-[#957AAA]" />

                        <input
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
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

            <div className="relative flex-1 overflow-hidden">
            
                <div className={`
                        absolute inset-0 z-0
                        overflow-y-auto 
                        chats-scroll
                        transition-all duration-50 ease-out

                        ${isSearchFocused
                            ? "scale-95 opacity-0 pointer-events-none"
                            : "scale-100 opacity-100"
                        }
                    `}
                >

                    {sortedChats.map((chat) => (
                        <ChatItem 
                            key={chat.id} 
                            chat={chat} 
                            lastMessageText={chat.messages[chat.messages.length - 1]?.text}
                            lastMessageTime={chat.messages[chat.messages.length - 1]?.time}
                            lastMessageDate={chat.messages[chat.messages.length - 1]?.date}
                            setSelectedChatId={handleSelectChat}
                            selectedChatId={selectedChatId}
                        />
                    ))}

                </div>

                <div className={`
                        absolute inset-0
                        overflow-y-auto chats-scroll
                        transition-all duration-50 ease-out

                        ${isSearchFocused
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-105 pointer-events-none"
                        }
                    `}
                >

                    {searchText.length > 0 && (
                        filteredChats.map((chat) => (
                            <ChatItem 
                                key={chat.id} 
                                chat={chat} 
                                lastMessageText={chat.messages[chat.messages.length - 1]?.text}
                                lastMessageTime={chat.messages[chat.messages.length - 1]?.time}
                                lastMessageDate={chat.messages[chat.messages.length - 1]?.date}
                                setSelectedChatId={handleSelectChat}
                                selectedChatId={selectedChatId}
                            />
                        ))
                    )}
            
                </div>
            
            </div>
            {!isMobile && (
                <div 
                    onMouseDown={(e) => {
                        e.preventDefault();

                        const startX = e.clientX;
                        const startWidth = sidebarWidth;

                        const handleMouseMove = (e) => {
                            const delta = e.clientX - startX;

                            const newWidth = startWidth + (delta / window.innerWidth) * 100;

                            if(newWidth >= 13 && newWidth <= 33) {
                                setSidebarWidth(newWidth);
                            }
                        };

                        const handleMouseUp = () => {
                            document.removeEventListener("mousemove", handleMouseMove);
                            document.removeEventListener("mouseup", handleMouseUp);
                        };

                        document.addEventListener("mousemove", handleMouseMove);
                        document.addEventListener("mouseup", handleMouseUp);
                    }}
                    className="
                        absolute
                        top-0
                        right-0
                        w-1
                        h-full
                        cursor-col-resize
                        transition-colors
                    "
                />
            )}
        
        </div>
    );
}
