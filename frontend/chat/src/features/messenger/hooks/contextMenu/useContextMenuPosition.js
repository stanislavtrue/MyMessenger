import { useLayoutEffect, useRef } from "react"

export const useContextMenuPosition = (contextMenu, setContextMenu, type) => {
    const menuRef = useRef(null);

    useLayoutEffect(() => {
        if (!contextMenu.visible || !contextMenu.isMeasuring || contextMenu.type !== type || !menuRef.current) return;
    
        const { width: menuWidth, height: menuHeight } = menuRef.current.getBoundingClientRect();

        let windowHeight = window.innerHeight;
        let windowWidth = window.innerWidth;

        if (type === "chat") {
            const sidebar = document.getElementById("sidebar");
            if (sidebar) {
                windowWidth = sidebar.getBoundingClientRect().right;
            }
        }

        let x = contextMenu.x;
        let y = contextMenu.y;

        const isUp = y + menuHeight > windowHeight;
        if (isUp) {
            y = y - menuHeight;
        }

        const isLeft = x + menuWidth > windowWidth;
        if (isLeft) {
            x = x - menuWidth;
        }

        setContextMenu((prev) => ({
            ...prev,
            x,
            y,
            isUp,
            isLeft,
            isMeasuring: false,
        }));
    }, [contextMenu.visible, contextMenu.isMeasuring, contextMenu.type, setContextMenu, type]);

    return menuRef;
};
