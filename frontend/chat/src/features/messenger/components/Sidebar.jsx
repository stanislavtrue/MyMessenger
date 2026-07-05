import { useEffect, useRef, useState } from "react";
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
import { RecentChatAvatar } from "./RecentChatAvatar";
import { MiniContactItem } from "./MiniContactItem";
import { highlightText } from "../utils/highlightText";
import { formatSidebarDate } from "../utils/formatSidebarDate";
import { Avatar } from "./Avatar";

export const Sidebar = ({ sidebarWidth, setSidebarWidth, chats, isMobile, selectedChatId, setSelectedChatId }) => {
    const { handleMouseDown } = useSidebarResize(sidebarWidth, setSidebarWidth);
    const { isSidebarMenuOpen, setIsSidebarMenuOpen, isSidebarSearchFocused, setIsSidebarSearchFocused, contextMenu, closeMenu, sidebarSearchText, setSidebarSearchText, isContactsMode, setIsContactsMode, closeSidebarSearch } = useMessengerContext();
    const { activeChats, contacts, filteredChats, filteredContacts, filteredMessages } = useSidebarSearch(chats, sidebarSearchText, isContactsMode);

    const [activeTab, setActiveTab] = useState("Chats");
    const [showAllContacts, setShowAllContacts] = useState(false);

    const tabs = ["Chats", "Channels", "Posts", "Media", "Links", "Files", "Music", "Voice"];

    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const inputRef = useRef(null);
    const tabsScrollRef = useRef(null);
    const recentChatsScrollRef = useRef(null);

    useEffect(() => {
        if (isContactsMode && inputRef.current) {
            inputRef.current.focus();
            setIsSidebarSearchFocused(true);
        }
    }, [isContactsMode, setIsSidebarSearchFocused]);

    const handleHorizontalWheel = (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            e.currentTarget.scrollLeft += e.deltaY * 0.2;
        }
    };

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);
        closeSidebarSearch();
        setShowAllContacts(false);
        setActiveTab("Chats");
    };

    const showBack = isSidebarSearchFocused || isContactsMode;
    const placeholderText = isContactsMode ? "Search contacts" : "Search";

    console.log("Sidebar search: ", sidebarSearchText);

    return (
        <div 
            id="sidebar"
            style={{
                width: isMobile ? "100%" : `${sidebarWidth}%`,
                minWidth: isMobile ? "100%" : "280px",
                maxWidth: isMobile ? "100%" : "650px"
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
                    mx-4! pt-2! pb-3! 
                    text-center 
                ">
                    <div className="flex items-center relative">

                        <div 
                            ref={buttonRef} 
                            onClick={() => {
                                if (showBack) {
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
                                    w-full h-10! pl-3!
                                    rounded-3xl text-white outline-none!
                                    placeholder:text-[#7F88C0]!
                                "
                                type="text"
                                placeholder={placeholderText}
                            />
                        </div>
                    </div>
                </div>

                <div className="relative flex flex-col flex-1 overflow-hidden">

                    {!showBack && (
                        <ChatList
                            chats={activeChats}
                            isVisible={true}
                            selectedChatId={selectedChatId}
                            onSelectChat={handleSelectChat}
                            animationClasses={"scale-100 opacity-100"}
                        />
                    )}

                    {isSidebarSearchFocused && !isContactsMode && !sidebarSearchText && (
                        <div className="relative flex flex-col flex-1 min-h-0">
                            <div className="absolute top-3 left-4 right-4 z-20">
                                <div
                                    ref={tabsScrollRef}
                                    onWheel={handleHorizontalWheel} 
                                    className="
                                        flex gap-2 py-1! px-1! 
                                        overflow-x-auto scrollbar-none 
                                        bg-[#111111] rounded-full shrink-0
                                        shadow-[0px_0px_5px_rgba(102,102,102,0.3)]
                                    "
                                >
                                    {tabs.map((tab) => {
                                        const isActive = activeTab === tab;
                                        return (
                                            <div
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`
                                                    px-4! py-2! font-medium! rounded-3xl cursor-pointer
                                                    hover:bg-[#282836]/50 transition-all duration-100 shrink-0
                                                    ${isActive
                                                        ? "text-[#B06EE4] bg-[#B06EE4]/10"
                                                        : "text-[#757993]"
                                                    }
                                                `}
                                            >
                                                {tab}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="absolute h-4 w-full bg-linear-to-b from-[#1F1F28] to-[#1F1F28]/10 z-10"/>
                            <div className="flex-1 overflow-y-auto px-4! pt-20! pb-4!">
                                <div 
                                    ref={recentChatsScrollRef} 
                                    onWheel={handleHorizontalWheel}
                                    className="flex items-center p-2! bg-[#111111] rounded-3xl overflow-x-auto scrollbar-none"
                                >
                                    {activeChats.slice(0, 10).map(chat => (
                                        <RecentChatAvatar 
                                            key={chat.id}
                                            chat={chat}
                                            isSelected={chat.id === selectedChatId}
                                            onSelect={handleSelectChat}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                
                    {isContactsMode && (
                        <div className="flex-1 overflow-y-auto">
                            {!sidebarSearchText ? (
                                contacts.map(contact => (
                                    <ContactItem
                                        key={contact.id}
                                        contact={contact}
                                        isSelected={contact.id === selectedChatId}
                                        onSelect={handleSelectChat}
                                    />
                                ))
                            ) : (
                                filteredContacts.map(item => (
                                    <ContactItem
                                        key={item.id}
                                        contact={item}
                                        isSelected={item.id === selectedChatId}
                                        onSelect={handleSelectChat}
                                    />
                                ))
                            )}
                        </div>
                    )}

                    {sidebarSearchText.length > 0 && !isContactsMode && (
                        <div className="relative flex flex-col flex-1 min-h-0">
                            <div className="absolute top-3 left-4 right-4 z-20">
                                {filteredChats.length > 0 && (
                                    <div 
                                        ref={recentChatsScrollRef} 
                                        onWheel={handleHorizontalWheel} 
                                        className="
                                            flex gap-2 py-2! px-2! 
                                            overflow-x-auto scrollbar-none 
                                            bg-[#111111] rounded-full shrink-0
                                            shadow-[0px_0px_5px_rgba(102,102,102,0.3)]
                                        "
                                    >
                                        {filteredChats.slice(0, 10).map(chat => (
                                            <MiniContactItem 
                                                key={chat.id}
                                                chat={chat}
                                                onSelect={handleSelectChat}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="absolute h-4 w-full bg-linear-to-b from-[#1F1F28] to-[#1F1F28]/10 z-10"/>
                            <div className="flex-1 overflow-y-auto px-4! pt-18! pb-4!">

                                {filteredContacts.length > 0 && (
                                    <div className="flex flex-col py-2! mb-4! bg-[#111111] rounded-3xl scrollbar-thin scrollbar-[#282836]">
                                        <span className="text-md! pl-6! pt-2! pb-2! font-semibold! text-[#B06EE4]">Chats</span>
                                        {filteredContacts.map(item => (
                                            <ContactItem 
                                                key={item.id}
                                                contact={item}
                                                isSelected={item.id === selectedChatId}
                                                onSelect={handleSelectChat}
                                            />
                                        ))}
                                    </div>
                                )}

                                {filteredMessages.length > 0 && (
                                    <div className="flex flex-col py-2! bg-[#111111] rounded-3xl scrollbar-thin scrollbar-[#282836]"> 
                                        <span className="text-md! pl-6! pt-2! pb-2! font-semibold! text-[#B06EE4]">Messages</span>
                                        {filteredMessages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                onClick={() => handleSelectChat(msg.chatId)}
                                                className="
                                                    flex items-center gap-3
                                                    px-3! py-1.5! mx-2!
                                                    rounded-2xl hover:bg-[#282836]/50
                                                    cursor-pointer transition-colors duration-0
                                                "
                                            >
                                                <div className={`
                                                    text-white text-xl! shrink-0
                                                `}>
                                                    <Avatar 
                                                        size="size-[54px]"
                                                        avatar={msg.chatUser.avatar}
                                                        name={msg.chatUser.displayName}
                                                    />
                                                </div>

                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <span className="text-md! font-medium! truncate">
                                                        {msg.chatUser.displayName}
                                                    </span>

                                                    <span className="text-white/50 text-sm! truncate mt-0.5!">
                                                        {highlightText(msg.text, sidebarSearchText)}
                                                    </span>
                                                </div>
                                            
                                                <span style={{fontFamily: "Roboto"}} className="text-xs! text-white/50 shrink-0 -mt-5!">
                                                    {formatSidebarDate(msg.date, msg.time)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>  
                                )}
                            </div>
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
