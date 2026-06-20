import { useEffect } from "react"

export const useMessengerKeyboard = ({
    contextMenuVisible,
    closeMenu,
    isSidebarMenuOpen,
    setIsSidebarMenuOpen,
    isEmojiPickerOpen,
    setIsEmojiPickerOpen,
    isSidebarSearchFocused,
    setIsSidebarSearchFocused,
    isChatSearchFocused,
    closeChatSearch,
    replyToMessage,
    closeReply,
    selectedChatId,
    setSelectedChatId,
}) => {

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key !== "Escape") return;

            if (contextMenuVisible) {
                closeMenu();
                return;
            }

            if (isSidebarMenuOpen) {
                setIsSidebarMenuOpen(false);
                return;
            }

            if (isEmojiPickerOpen) {
                setIsEmojiPickerOpen(false);
                return;
            }

            if (isSidebarSearchFocused) {
                setIsSidebarSearchFocused(false);
                return;
            }

            if (isChatSearchFocused) {
                closeChatSearch();
                return;
            }

            if (replyToMessage) {
                closeReply();
                return;
            }

            if (selectedChatId) {
                setSelectedChatId(null);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };

    }, [
        contextMenuVisible,
        isSidebarMenuOpen,
        isEmojiPickerOpen,
        isSidebarSearchFocused,
        isChatSearchFocused,
        replyToMessage,
        selectedChatId
    ]);
};
