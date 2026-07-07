import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const ConfirmModal = ({ 
    isOpen, onClose, onConfirm, 
    title = "Confirm action", 
    description = "Are you sure you want to proceed?", 
    confirmText = "CONFIRM",
    cancelText = "CANCEL",
    isDanger = false
}) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) setIsClosing(false);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose()
        }, 150);
    };

    const handleConfirm = () => {
        setIsClosing(true);
        setTimeout(() => {
            onConfirm();
        }, 150);
    };

    return createPortal(
        <div
            onClick={handleClose} 
            className={`
                fixed inset-0 z-100 flex items-center justify-center bg-black/25
                ${isClosing ? "animate-backdrop-out" : "animate-backdrop-in"}
            `}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className={`
                    flex flex-col gap-2 px-6! py-4! w-75
                    bg-[#1E1E22] rounded-[40px] select-none
                    shadow-[0px_0px_5px_rgba(0,0,0,0.8)]
                    ${isClosing ? "animate-modal-out" : "animate-modal-in"}
                `}
            >
                <div className="flex flex-col gap-3">
                    <span className="text-xl! font-semibold!">{title}</span>
                    <span className="leading-normal">{description}</span>
                </div>

                <div className="flex justify-end gap-2 font-medium!">
                    <div 
                        onClick={handleClose}
                        className="px-4! py-2! rounded-2xl text-[#7D55B5] hover:bg-[#7D55B5]/10 transition-all duration-200"
                    >
                        {cancelText}
                    </div>
                    <div
                        onClick={handleConfirm}
                        className={`
                            px-3! py-2! rounded-2xl transition-all duration-200
                            ${isDanger ? "text-[#DC3545] hover:bg-[#DC3545]/10" : ""}
                        `}
                    >
                        {confirmText}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
