import { useMessengerContext } from "../context/MessengerContext";
import { useContextMenuAnimation } from "../hooks/useContextMenuAnimation";
import { useContextMenuPosition } from "../hooks/useContextMenuPosition";
import { MessageReactionPicker } from "./MessageReactionPicker";

export const ContextMenuWrapper = ({ children, type, width = "w-42" }) => {
    const { contextMenu, setContextMenu, closeMenu, handleSetReaction } = useMessengerContext();

    const isOpen = contextMenu.visible && contextMenu.type === type;

    const { shouldRender, animationClass } = useContextMenuAnimation(isOpen, contextMenu.isMeasuring);

    const menuRef = useContextMenuPosition(contextMenu, setContextMenu, type);

    const isActive = shouldRender || (contextMenu.visible && contextMenu.type === type && contextMenu.isMeasuring);
    if (!isActive) return null;

    const transformOrigin = `${contextMenu.isUp ? "bottom" : "top"} ${contextMenu.isLeft ? "right" : "left"}`;

    return (
        <>
            {type === "message" && (
                <div
                    style={{
                        top: `${contextMenu.isUp ? contextMenu.y - 45 : contextMenu.y - 45}px`,
                        left: `${contextMenu.x}px`,
                        transformOrigin: transformOrigin,
                    }}
                    className={`fixed z-50 context-menu ${width} ${animationClass}`}
                >
                    <div className="relative w-full h-10">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -ml-5! w-max">
                            <MessageReactionPicker
                                onReactionSelect={(emoji) => {
                                    if (contextMenu.messageData) {
                                        handleSetReaction(contextMenu.messageData.id, emoji);
                                    }
                                    closeMenu();
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div
                ref={menuRef}
                style={{
                    top: `${contextMenu.y}px`,
                    left: `${contextMenu.x}px`,
                    fontFamily: "Roboto",
                    transformOrigin: transformOrigin,
                }}
                className={`
                    fixed z-50 flex flex-col context-menu
                    bg-[#272739]/80 backdrop-blur-md
                    rounded-xl shadow-lg shadow-black/70
                    px-1! py-1!
                    ${width} ${animationClass}
                `}
            >
                {children}
            </div>
        </>
    );
};
