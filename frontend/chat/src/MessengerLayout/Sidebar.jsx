import { useRef } from "react";
import { ChatItem } from "./ChatItem"
import { Settings, ArrowLeft, SquareArrowOutUpRight, Eye, Pin, BellOff, Trash, Plus, EllipsisVertical } from "lucide-react";
import { TfiMenu } from "react-icons/tfi";
import { BsPeople, BsPerson, BsChevronRight } from "react-icons/bs";
import { SlMagnifier } from "react-icons/sl";
import { useSidebarSearch } from "../hooks/useSidebarSearch";
import { useSidebarResize } from "../hooks/useSidebarResize";
import { useMessengerContext } from "../context/MessengerContext";
import { PiBookmarkSimple } from "react-icons/pi";
import { ContextMenuWrapper } from "./ContextMenuWrapper";

export const Sidebar = ({ sidebarWidth, setSidebarWidth, chats, isMobile, selectedChatId, setSelectedChatId }) => {
    const { searchText, setSearchText, sortedChats, filteredChats } = useSidebarSearch(chats);
    const { handleMouseDown } = useSidebarResize(sidebarWidth, setSidebarWidth);
    const { isSidebarMenuOpen, setIsSidebarMenuOpen, isSidebarSearchFocused, setIsSidebarSearchFocused, contextMenu, showMenu, closeMenu } = useMessengerContext();

    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);

        setIsSidebarSearchFocused(false);
        setSearchText("");
    };

    return (
        <div 
            id="sidebar"
            style={{
                width: isMobile ? "100%" : `${sidebarWidth}%`,
                minWidth: isMobile ? "100%" : "240px",
                maxWidth: isMobile ? "100%" : "650px"
            }}
            className="relative h-screen w-full flex flex-col border-r! border-[#282836]! bg-[#1F1F28] select-none shrink-0"
        >

            {isSidebarMenuOpen && (
                <div 
                    onClick={() => setIsSidebarMenuOpen(false)}
                    className="fixed inset-0 z-40"
                />
            )}

            {contextMenu.visible && contextMenu.type === "chat" && (
                <div
                    onClick={closeMenu}
                    className="fixed inset-0 z-40"
                />
            )}

            <div className="
                px-3! pt-1! pb-3! 
                text-center 
            ">
                <div className="flex items-center relative">

                    <div 
                        ref={buttonRef} 
                        onClick={() => {
                            if (isSidebarSearchFocused) {
                                setIsSidebarSearchFocused(false)
                                setSearchText("")
                            } else {
                                setIsSidebarMenuOpen(!isSidebarMenuOpen);
                            }
                        }}
                        className="
                            relative
                            flex items-center justify-center 
                            h-11 w-11
                            rounded-full 
                            hover:bg-[#282836]
                            active:scale-90
                            active:bg-[#52526B]
                            transition-all duration-300
                            cursor-pointer
                            overflow-hidden
                        "
                    >
                        <TfiMenu 
                            size={22}
                            className={`
                                absolute
                                transition-all duration-300
                                text-[#707099]
                                
                                ${isSidebarSearchFocused
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

                                ${isSidebarSearchFocused
                                    ? "opacity-100 rotate-0 scale-100"
                                    : "opacity-0 -rotate-180 scale-50"
                                }
                            `}
                        />
                    </div>


                    <div
                        style={{
                            fontFamily: "Roboto"
                        }}
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

                            ${isSidebarMenuOpen
                                ? "opacity-100 translate-x-1 translate-y-1 scale-100"
                                : "opacity-0 -translate-x-1 -translate-y-1 scale-80 pointer-events-none"
                            }
                        `}
                    >
                        <div className="
                                flex items-center gap-4
                                px-3! py-1! mx-1! my-1!
                                rounded-md
                                hover:bg-[#131319]/80
                                cursor-pointer
                                transition-colors
                                duration-0
                            "
                        >
                            <div className="size-5.5 bg-white rounded-full" />
                            <span className="text-sm!">User</span>

                        </div>

                        <div className="h-px! w-full bg-[#52526B] my-1!" />

                        <div className="
                                flex items-center gap-4
                                px-3! py-1! mx-1! my-1!
                                rounded-lg
                                hover:bg-[#131319]/80
                                cursor-pointer
                                transition-colors
                                duration-0
                            "
                        >
                            <Plus size={22} className="text-[#8888BA]" />
                            <span className="text-sm!">Add Account</span>

                        </div>

                        <div className="h-px! w-full bg-[#52526B] my-1!" />
                        
                        <div className="
                                flex items-center gap-4.5
                                px-3! py-1.5! mx-1! my-1!
                                rounded-lg
                                hover:bg-[#131319]/80
                                cursor-pointer
                                transition-colors
                                duration-0
                            "
                        >
                            <BsPerson size={20} className="text-[#8888BA]" />
                            <span className="text-sm!">My Profile</span>

                        </div>

                        <div className="
                                flex items-center gap-4.5
                                px-3! py-1.5! mx-1! my-1!
                                rounded-lg
                                hover:bg-[#131319]/80
                                cursor-pointer
                                transition-colors
                                duration-0
                            "
                        >
                            <PiBookmarkSimple size={20} className="text-[#8888BA]" />
                            <span className="text-sm!">Saved Messages</span>

                        </div>

                        <div className="
                                flex items-center gap-4.5
                                px-3! py-1.5! mx-1! my-1!
                                rounded-lg
                                hover:bg-[#131319]/80
                                cursor-pointer
                                transition-colors
                                duration-0
                            "
                        >
                            <BsPeople size={20} className="text-[#8888BA]" />
                            <span className="text-sm!">Contacts</span>

                        </div>

                        <div className="
                                flex items-center gap-4.5
                                px-3! py-1.5! mx-1! my-1!
                                rounded-lg
                                hover:bg-[#131319]/80
                                cursor-pointer
                                transition-colors
                                duration-0
                            "
                        >
                            <Settings size={20} className="text-[#8888BA]" />
                            <span className="text-sm!">Settings</span>

                        </div>
                        
                        <div className="
                                flex items-center gap-4.5
                                px-3! py-1.5! mx-1! my-1!
                                rounded-lg
                                hover:bg-[#131319]/80
                                cursor-pointer
                                transition-colors
                                duration-0
                            "
                        >
                            <EllipsisVertical size={20} className="text-[#8888BA]" />
                            <span className="text-sm!">More</span>
                            <BsChevronRight size={15} className="text-[#8888BA] ml-20!" />

                        </div>
                    
                </div>

                    <div className="w-full! flex flex-1 items-center group focus-within:ring-2 focus-within:ring-[#957AAA] bg-[#16161D] transition-all duration-300 rounded-3xl ml-3! pl-4!">

                        <SlMagnifier size={18} strokeWidth={50} className="text-[#52526B] transition-colors group-focus-within:text-[#957AAA]" />

                        <input
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onFocus={() => setIsSidebarSearchFocused(true)}
                            className="
                                w-full h-12!
                                rounded-3xl 
                                pl-3!
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

                        ${isSidebarSearchFocused
                            ? "scale-95 opacity-0 pointer-events-none"
                            : "scale-100 opacity-100"
                        }
                    `}
                >

                    {sortedChats.map((chat) => {
                        const isContextActive = contextMenu.visible && contextMenu.type === "chat" && contextMenu.messageData?.id === chat.id;

                        return (
                            <ChatItem 
                                key={chat.id} 
                                chat={chat} 
                                lastMessageText={chat.messages[chat.messages.length - 1]?.text}
                                lastMessageTime={chat.messages[chat.messages.length - 1]?.time}
                                lastMessageDate={chat.messages[chat.messages.length - 1]?.date}
                                setSelectedChatId={handleSelectChat}
                                selectedChatId={selectedChatId}
                                isContextActive={isContextActive}
                                onContextMenu={(e) => showMenu(e, chat, "chat")}
                            />
                        );
                    })}
                </div>

                <div className={`
                        absolute inset-0
                        overflow-y-auto chats-scroll
                        transition-all duration-50 ease-out

                        ${isSidebarSearchFocused
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-105 pointer-events-none"
                        }
                    `}
                >

                    {searchText.length > 0 && (
                        filteredChats.map((chat) => {
                            const isContextActive = contextMenu.visible && contextMenu.type === "chat" && contextMenu.messageData?.id === chat.id;
                            
                            return (
                                <ChatItem 
                                    key={chat.id} 
                                    chat={chat} 
                                    lastMessageText={chat.messages[chat.messages.length - 1]?.text}
                                    lastMessageTime={chat.messages[chat.messages.length - 1]?.time}
                                    lastMessageDate={chat.messages[chat.messages.length - 1]?.date}
                                    setSelectedChatId={handleSelectChat}
                                    selectedChatId={selectedChatId}
                                    isContextActive={isContextActive}
                                    onContextMenu={(e) => showMenu(e, chat, "chat")}
                                />
                            );
                        })
                    )}
            
                </div>

                <ContextMenuWrapper type="chat" width="w-52">
                    <button
                        className="flex items-center gap-5 px-3! py-2! text-sm! font-semibold! text-white rounded-lg hover:bg-[#131319]/80! cursor-pointer transition-colors duration-0"
                    >
                        <SquareArrowOutUpRight strokeWidth={2.5} size={18} className="text-[#8888BA]" />
                        <span>Open in New Tab</span>
                    </button>

                    <button
                        className="flex items-center gap-5 px-3! py-2! text-sm! font-semibold! text-white rounded-lg hover:bg-[#131319]/80! cursor-pointer transition-colors duration-0"
                    >
                        <Eye strokeWidth={2.5} size={18} className="text-[#8888BA]" />
                        <span>Quick Preview</span>
                    </button>
                    
                    <button
                        className="flex items-center gap-5 px-3! py-2! text-sm! font-semibold! text-white rounded-lg hover:bg-[#131319]/80! cursor-pointer transition-colors duration-0"
                    >
                        <Pin strokeWidth={2.5} size={18} className="text-[#8888BA]" />
                        <span>Pin to Top</span>
                    </button>

                    <button
                        className="flex items-center gap-5 px-3! py-2! text-sm! font-semibold! text-white rounded-lg hover:bg-[#131319]/80! cursor-pointer transition-colors duration-0"
                    >
                        <BellOff strokeWidth={2.5} size={18} className="text-[#8888BA]" />
                        <span>Mute...</span>
                    </button>

                    <button
                        className="flex items-center gap-5 px-3! py-2! text-sm! font-semibold! text-red-500! rounded-lg hover:bg-[#131319]/80! hover:text-white! cursor-pointer transition-colors duration-0"
                    >
                        <Trash strokeWidth={2.5} size={18} />
                        <span>Delete Chat</span>
                    </button>
                </ContextMenuWrapper>
            
            </div>
            {!isMobile && (
                <div 
                    onMouseDown={handleMouseDown}
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
