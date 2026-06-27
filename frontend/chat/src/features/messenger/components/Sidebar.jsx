import { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { TfiMenu } from "react-icons/tfi";
import { SlMagnifier } from "react-icons/sl";
import { useSidebarSearch } from "../hooks/useSidebarSearch";
import { useSidebarResize } from "../hooks/useSidebarResize";
import { useMessengerContext } from "../context/MessengerContext";
import { ContextMenuWrapper } from "./ContextMenuWrapper";
import { CHAT_CONTEXT_MENU } from "../constants/sidebarMenuItems";
import { SidebarMenu } from "@/features/messenger/components/SidebarMenu";
import { ChatList } from "@/features/messenger/components/ChatList";
import { ContactItem } from "./ContactItem";

export const Sidebar = ({ sidebarWidth, setSidebarWidth, chats, isMobile, selectedChatId, setSelectedChatId }) => {
    const { searchText, setSearchText, isContactsMode, setIsContactsMode, activeChats, contacts, filteredResults } = useSidebarSearch(chats);
    const { handleMouseDown } = useSidebarResize(sidebarWidth, setSidebarWidth);
    const { isSidebarMenuOpen, setIsSidebarMenuOpen, isSidebarSearchFocused, setIsSidebarSearchFocused, contextMenu, closeMenu } = useMessengerContext();

    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);
        setIsSidebarSearchFocused(false);
        setSearchText("");
    };

    const showBack = isSidebarSearchFocused || isContactsMode;

    return (
        <div 
            id="sidebar"
            style={{
                width: isMobile ? "100%" : `${sidebarWidth}%`,
                minWidth: isMobile ? "100%" : "350px",
                maxWidth: isMobile ? "100%" : "500px"
            }}
            className="relative h-screen flex flex-col p-4! pr-1.5! select-none shrink-0"
        >

            <div className="
                relative flex-1 flex flex-col w-full h-full
                rounded-3xl bg-[#1F1F28]/60
                border! border-[#808080]! select-none 
                overflow-hidden
            ">

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
                                if (showBack) {
                                    setIsSidebarSearchFocused(false)
                                    setIsContactsMode(false);
                                    setSearchText("")
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
                                    absolute text-white
                                    transition-all duration-300
                                    
                                    ${showBack
                                        ? "opacity-0 rotate-180 scale-50"
                                        : "opacity-100 rotate-0 scale-100"
                                    }
                                `}
                            />

                            <ArrowLeft
                                size={26}
                                className={`
                                    absolute text-white
                                    transition-all duration-300    

                                    ${showBack
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

                        <div className="w-full! flex flex-1 items-center group focus-within:ring-2 focus-within:ring-[#957AAA] bg-[#111111] transition-all duration-300 rounded-3xl ml-3! pl-4!">

                            <SlMagnifier size={18} strokeWidth={50} className="text-[#7F88C0] transition-colors group-focus-within:text-[#957AAA]" />

                            <input
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onFocus={() => setIsSidebarSearchFocused(true)}
                                className="
                                    w-full h-11! pl-3!
                                    rounded-3xl text-white outline-none!
                                    placeholder:text-[#7F88C0]!
                                "
                                type="text"
                                placeholder="Search"
                            />
                        </div>
                    </div>
                </div>

                <div className="relative flex-1 overflow-hidden">

                    {!showBack && (
                        <ChatList
                            chats={activeChats}
                            isVisible={true}
                            selectedChatId={selectedChatId}
                            onSelectChat={handleSelectChat}
                            animationClasses={"scale-100 opacity-100"}
                        />
                    )}
                
                    {isContactsMode && !searchText && (
                        <div className="animate-scale-up">
                            {contacts.map(contact => (
                                <ContactItem
                                    key={contact.id}
                                    contact={contact}
                                    isSelected={contact.id === selectedChatId}
                                    onSelect={handleSelectChat}
                                />
                            ))}
                        </div>
                    )}

                    {searchText.length > 0 && (
                        <div className="animate-scale-up">
                            {isContactsMode ? (
                                filteredResults.map(contact => (
                                    <ContactItem
                                        key={contact.id}
                                        contact={contact}
                                        isSelected={contact.id === selectedChatId}
                                        onSelect={handleSelectChat}
                                    />
                                ))
                            ) : (
                                <ChatList
                                    chats={filteredResults}
                                    isVisible={true}
                                    selectedChatId={selectedChatId}
                                    onSelectChat={handleSelectChat}
                                    animationClasses="opacity-100 scale-100"
                                />
                            )}
                        </div>
                    )}
                    
                    <ContextMenuWrapper type="chat" width="w-48">
                        {CHAT_CONTEXT_MENU.map((item) => {
                            const Icon = item.icon;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => closeMenu()}
                                    className={`
                                        flex items-center gap-5 px-3! py-1.5! text-sm! font-semibold! rounded-2xl
                                        cursor-pointer transition-colors duration-0 w-full text-left
                                        
                                        ${item.isDanger
                                            ? "text-red-500! hover:bg-[#282835]/50! hover:text-white!"
                                            : "text-white hover:bg-[#282836]/50!"
                                        }
                                    `}
                                >
                                    <Icon strokeWidth={2.5} size={18} className={item.isDanger ? "" : "text-[#8888BA]"} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </ContextMenuWrapper>
                
                </div>
            </div>
            {!isMobile && (
                <div 
                    onMouseDown={handleMouseDown}
                    className="
                        absolute top-0 right-0 
                        w-1 h-full
                        cursor-col-resize transition-colors
                    "
                />
            )}
        </div>
    );
}
