import { useEffect, useRef, useState } from "react";
import { ChatItem } from "./ChatItem"
import { Search, Menu, User, Settings, ArrowLeft, SquareArrowOutUpRight, Eye, Pin, BellOff, Trash } from "lucide-react";
import { useSidebarSearch } from "../hooks/useSidebarSearch";
import { useSidebarResize } from "../hooks/useSidebarResize";
import { useMessengerContext } from "../context/MessengerContext";
import { useContextMenu } from "../hooks/useContextMenu";
import { ContextMenuWrapper } from "./ContextMenuWrapper";

export const Sidebar = ({ sidebarWidth, setSidebarWidth, chats, isMobile, selectedChatId, setSelectedChatId }) => {
    const { searchText, setSearchText, sortedChats, filteredChats } = useSidebarSearch(chats);
    const { handleMouseDown } = useSidebarResize(sidebarWidth, setSidebarWidth);
    const { isSidebarMenuOpen, setIsSidebarMenuOpen, isSearchFocused, setIsSearchFocused, contextMenu, setContextMenu } = useMessengerContext();
    const { showMenu, closeMenu } = useContextMenu(contextMenu, setContextMenu);

    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);

        setIsSearchFocused(false);
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
                                setIsSidebarMenuOpen(!isSidebarMenuOpen);
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

                            ${isSidebarMenuOpen
                                ? "opacity-100 translate-x-1 translate-y-1 scale-100"
                                : "opacity-0 -translate-x-1 -translate-y-1 pointer-events-none"
                            }
                        `}
                    >
                        <div className="
                                flex items-center gap-4
                                px-2! py-1!
                                rounded-lg
                                hover:bg-[#131319]/80
                                cursor-pointer
                                transition-colors
                                duration-0
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
                                hover:bg-[#131319]/80
                                cursor-pointer
                                transition-colors
                                duration-0
                            "
                        >
                            <Settings size={20} className="text-[#8888BA]" />
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

                        ${isSearchFocused
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
