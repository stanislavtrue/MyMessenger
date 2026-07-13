import { createPortal } from "react-dom";

export const ModalWrapper = ({ isOpen, isClosing, onClose, children }) => {
    if (!isOpen) return null;

    return createPortal(
        <div
            onClick={onClose} 
            className={`
                fixed inset-0 z-100 flex items-center justify-center bg-black/25
                ${isClosing ? "animate-backdrop-out" : "animate-backdrop-in"}
            `}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="contents"
            >
                {children}
            </div>
        </div>,
        document.body
    );
};
