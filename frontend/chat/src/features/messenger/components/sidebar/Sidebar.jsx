import { useEffect, useRef, useState } from "react";
import { useSidebarResize } from "../../hooks/sidebar/useSidebarResize";
import { useSidebarSearch } from "../../hooks/sidebar/useSidebarSearch";
import { useMessengerContext } from "../../context/MessengerContext";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarScreen } from "./screens/SidebarScreen";
import { SidebarContextMenu } from "./SidebarContextMenu";

export const Sidebar = ({ sidebarWidth, setSidebarWidth, chats, isMobile, selectedChatId, setSelectedChatId }) => {
    const { handleMouseDown, isResizing } = useSidebarResize(sidebarWidth, setSidebarWidth);
    const { isSidebarMenuOpen, setIsSidebarMenuOpen, isSidebarSearchFocused, setIsSidebarSearchFocused, contextMenu, closeMenu, sidebarSearchText, setSidebarSearchText, isContactsMode, setIsContactsMode, closeSidebarSearch } = useMessengerContext();
    const { activeChats, contacts, filteredChats, filteredContacts, filteredMessages } = useSidebarSearch(chats, sidebarSearchText, isContactsMode);

    const [showAllContacts, setShowAllContacts] = useState(false);

    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isContactsMode && inputRef.current) {
            inputRef.current.focus();
            setIsSidebarSearchFocused(true);
        }
    }, [isContactsMode, setIsSidebarSearchFocused]);

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);
        closeSidebarSearch();
        setShowAllContacts(false);
    };

    return (
        <div 
            id="sidebar"
            style={{
                width: isMobile ? "100%" : `${sidebarWidth}%`,
                minWidth: isMobile ? "100%" : "280px",
                maxWidth: isMobile ? "100%" : "650px"
            }}
            className="relative h-screen flex flex-col py-4! pl-4! select-none shrink-0"
        >
            <div className="
                relative flex-1 flex flex-col w-full h-full rounded-3xl
                bg-[#1C1C1C]/80 select-none overflow-hidden
            ">

                {(isSidebarMenuOpen || (contextMenu.visible && contextMenu.type === "chat")) && (
                    <div 
                        className="fixed inset-0 z-40"
                        onClick={() => {
                            setIsSidebarMenuOpen(false);
                            closeMenu();
                        }}
                    />
                )}

                <SidebarHeader
                    menuRef={menuRef}
                    buttonRef={buttonRef}
                    inputRef={inputRef}
                />

                <div className="relative flex flex-col flex-1 overflow-hidden">

                    <SidebarScreen
                        filteredChats={filteredChats}
                        filteredContacts={filteredContacts}
                        filteredMessages={filteredMessages}
                        activeChats={activeChats}
                        selectedChatId={selectedChatId}
                        handleSelectChat={handleSelectChat}
                        contacts={contacts}
                    />
                    
                    <SidebarContextMenu closeMenu={closeMenu} />

                
                </div>
                {!isMobile && (
                    <div 
                        onMouseDown={handleMouseDown}
                        className={`
                            absolute top-0 right-0 w-0.5 h-full
                            hover:bg-[#959595] cursor-col-resize transition-colors
                            ${isResizing ? "bg-[#959595]" : "bg-transparent"}
                        `}
                    />
                )}
            </div>
        </div>
    );
}
