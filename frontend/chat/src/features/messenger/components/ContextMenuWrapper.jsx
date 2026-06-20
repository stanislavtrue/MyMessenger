import { useMessengerContext } from "../context/MessengerContext";
import { useContextMenuAnimation } from "../hooks/useContextMenuAnimation";
import { useContextMenuPosition } from "../hooks/useContextMenuPosition";

export const ContextMenuWrapper = ({ children, type, width = "w-42" }) => {
    const { contextMenu, setContextMenu } = useMessengerContext();

    const isOpen = contextMenu.visible && contextMenu.type === type;

    const { shouldRender, animationClass } = useContextMenuAnimation(isOpen, contextMenu.isMeasuring);

    const menuRef = useContextMenuPosition(contextMenu, setContextMenu, type);

    const isActive = shouldRender || (contextMenu.visible && contextMenu.type === type && contextMenu.isMeasuring);
    if (!isActive) return null;

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
                fixed z-50 rounded-xl bg-[#272739]/70
                backdrop-blur-sm shadow-black shadow-lg
                py-1! px-1! flex flex-col context-menu
                ${width}
                ${animationClass}
            `}
        >
            {children}
        </div>
    );
};
