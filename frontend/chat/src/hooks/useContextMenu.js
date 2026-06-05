import { useCallback, useEffect, useState } from "react"

export const useContextMenu = (contextMenu, setContextMenu) => {
    const showMenu = useCallback((event, message) => {
        event.preventDefault();

        setContextMenu({
            visible: true,
            x: event.clientX + 5,
            y: event.clientY + 5,
            messageData: message,
        });
    }, [contextMenu.visible, setContextMenu]);

    const closeMenu = useCallback(() => {
        setContextMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    }, [setContextMenu]);

    return { showMenu, closeMenu };
};
