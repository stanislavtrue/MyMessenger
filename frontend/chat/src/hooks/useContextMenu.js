import { useCallback } from "react"

export const useContextMenu = (contextMenu, setContextMenu) => {
    const showMenu = useCallback((event, message, type = "message") => {
        event.preventDefault();

        setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            isUp: false,
            isLeft: false,
            type: type,
            messageData: message,
            isMeasuring: true,
        });
    }, [setContextMenu]);

    const closeMenu = useCallback(() => {
        setContextMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    }, [setContextMenu]);

    return { showMenu, closeMenu };
};
