import { useMessengerContext } from "../../context/MessengerContext";
import { useContextMenuAnimation } from "../../hooks/contextMenu/useContextMenuAnimation";
import { useContextMenuPosition } from "../../hooks/contextMenu/useContextMenuPosition";
import { MessageReactionPicker } from "../chat/MessageReactionPicker";

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
            {isOpen && (
                <div onClick={closeMenu} className="fixed inset-0 z-40 bg-transparent"/>
            )}
            
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
                    fixed z-50 flex flex-col context-menu bg-[#1C1C1C] rounded-xl
                    shadow-[0px_0px_10px_2px_rgba(0,0,0,0.5)] px-1! py-1!
                    ${width} ${animationClass}
                `}
            >
                {children}
            </div>
        </>
    );
};
