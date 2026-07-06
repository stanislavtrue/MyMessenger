import { useEffect, useRef, useState } from "react";
import { useSidebarResize } from "../../hooks/useSidebarResize";
import { useSidebarSearch } from "../../hooks/useSidebarSearch";
import { useMessengerContext } from "../../context/MessengerContext";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarContextMenu } from "./SidebarContextMenu";
import { SidebarScreen } from "./screens/SidebarScreen";

export const Sidebar = ({ sidebarWidth, setSidebarWidth, chats, isMobile, selectedChatId, setSelectedChatId }) => {
    const { handleMouseDown } = useSidebarResize(sidebarWidth, setSidebarWidth);
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
            className="relative h-screen flex flex-col p-4! pr-1.5! select-none shrink-0"
        >
            <div className="
                relative flex-1 flex flex-col w-full h-full rounded-3xl
                bg-[#1F1F28]/60 select-none overflow-hidden
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
            </div>

            {!isMobile && (
                <div 
                    onMouseDown={handleMouseDown}
                    className="
                        absolute top-0 right-0 w-1 h-full
                        cursor-col-resize transition-colors
                    "
                />
            )}
        </div>
    );
}
