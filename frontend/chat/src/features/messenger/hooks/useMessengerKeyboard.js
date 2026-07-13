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
    closeSidebarSearch,
    isConfirmModalOpen,
    closeConfirmModal,
    isAddContactOpen,
    closeAddContact,
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

            if (isAddContactOpen) {
                closeAddContact();
                return;
            }

            if (isConfirmModalOpen) {
                closeConfirmModal();
                return;
            }

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
                closeSidebarSearch();
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
        isAddContactOpen,
        isConfirmModalOpen,
        contextMenuVisible,
        isSidebarMenuOpen,
        isEmojiPickerOpen,
        isSidebarSearchFocused,
        isChatSearchFocused,
        replyToMessage,
        selectedChatId
    ]);
};
