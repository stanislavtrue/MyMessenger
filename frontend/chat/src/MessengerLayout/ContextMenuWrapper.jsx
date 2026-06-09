import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMessengerContext } from "../context/MessengerContext"

export const ContextMenuWrapper = ({ children, type, width = "w-42" }) => {
    const { contextMenu, setContextMenu } = useMessengerContext();
    const menuRef = useRef(null);

    const isCurrentTypeActive = contextMenu.visible && contextMenu.type === type;
    const [shouldRender, setShouldRender] = useState(isCurrentTypeActive);

    const isOpen = contextMenu.visible && contextMenu.type === type;

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            return;
        } 
        const timer = setTimeout(() => {
            setShouldRender(false);
        }, 120);

            return () => clearTimeout(timer);
        
    }, [isOpen]);

    useLayoutEffect(() => {
        if (!contextMenu.visible || !contextMenu.isMeasuring || contextMenu.type !== type || !menuRef.current) return;

        const { width: menuWidth, height: menuHeight } = menuRef.current.getBoundingClientRect();

        let windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (type === "chat") {
            if (document.getElementById("sidebar")) {
                windowWidth = document.getElementById("sidebar").getBoundingClientRect().right;
            }
        }

        let x = contextMenu.x;
        let y = contextMenu.y;

        const isUp = y + menuHeight > windowHeight;
        if (isUp) {
            y = y - menuHeight;
        }
        console.log(y);

        const isLeft = x + menuWidth > windowWidth;
        if (isLeft) {
            x = x - menuWidth;
        }

        setContextMenu((prev) => ({
            ...prev,
            x: x,
            y: y,
            isUp,
            isLeft,
            isMeasuring: false,
        }));
    }, [contextMenu.visible, contextMenu.isMeasuring, contextMenu.type, setContextMenu, type]);


    let animationClass = "closed";
    if (isOpen) {
        animationClass = contextMenu.isMeasuring ? "measuring" : "open";
    }

    return (
        <div
            ref={menuRef}
            style={{
                top: `${contextMenu.y}px`,
                left: `${contextMenu.x}px`,
                fontFamily: "Roboto",
                transformOrigin: `${contextMenu.isUp ? "bottom" : "top"} ${contextMenu.isLeft ? "right" : "left"}`,
            }}
            className={`
                fixed z-50
                rounded-xl
                bg-[#272739]/70
                backdrop-blur-sm
                shadow-black
                shadow-lg
                py-1! px-1!
                flex flex-col
                context-menu

                ${width}
                ${animationClass}
            `}
        >
            {children}
        </div>
    );
};
