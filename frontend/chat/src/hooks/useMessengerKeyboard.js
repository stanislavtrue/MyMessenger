import { act, useEffect } from "react"

export const useMessengerKeyboard = (actions, dependencies) => {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key !== "Escape") return;

            if (actions.contextMenuVisible) { actions.closeMenu(); return; }
            if (actions.isSidebarMenuOpen) { actions.setIsSidebarMenuOpen(false); return; }
            if (actions.isEmojiPickerOpen) { actions.setIsEmojiPickerOpen(false); return; }
            if (actions.isSidebarSearchFocused) { actions.setIsSidebarSearchFocused(false); return; }
            if (actions.isChatSearchFocused) { actions.setIsChatSearchFocused(false); return; }
            if (actions.replyToMessage) { actions.closeReply(); return; }
            if (actions.selectedChatId) { actions.setSelectedChatId(null); return; }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, dependencies);
};
