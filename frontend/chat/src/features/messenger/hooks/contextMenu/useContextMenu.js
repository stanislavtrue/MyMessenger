import { useCallback, useState } from "react"

export const useContextMenu = () => {
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        isUp: false,
        isLeft: false,
        type: null,
        messageData: null,
        isMeasuring: true,
    });

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

    return { contextMenu, setContextMenu, showMenu, closeMenu };
};
