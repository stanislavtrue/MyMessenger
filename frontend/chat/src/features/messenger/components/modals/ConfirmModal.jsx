import { useModalAnimation } from "../../hooks/modal/useModalAnimation";
import { ModalWrapper } from "./ModalWrapper";

export const ConfirmModal = ({ 
    isOpen, onClose, onConfirm, 
    title = "Confirm action", 
    description = "Are you sure you want to proceed?", 
    confirmText = "CONFIRM",
    cancelText = "CANCEL",
    isDanger = false
}) => {
    const { isClosing, handleClose } = useModalAnimation(isOpen, onClose); 

    const handleConfirm = () => {
        handleClose(onConfirm);
    };

    return (
        <ModalWrapper isOpen={isOpen} isClosing={isClosing} onClose={() => handleClose()}>
            <div className={`
                flex flex-col gap-2 px-6! py-4! w-90 bg-[#1C1C1C] rounded-[40px] select-none
                shadow-[0px_0px_5px_rgba(0,0,0,0.8)] border-l! border-r! border-[#2C2C2C]
                ${isClosing ? "animate-modal-out" : "animate-modal-in"}
            `}>
                <div className="flex flex-col gap-4 pt-2!">
                    <span className="text-xl! font-semibold!">{title}</span>
                    <span className="leading-normal">{description}</span>
                </div>

                <div className="flex justify-end gap-2 font-medium! pt-2!">
                    <div 
                        onClick={() => handleClose()}
                        className="px-3! py-2! rounded-2xl text-[#527AFF]! hover:bg-[#527AFF]/10! transition-all duration-200 cursor-pointer"
                    >
                        {cancelText}
                    </div>
                    <div
                        onClick={handleConfirm}
                        className={`
                            px-4! py-2! rounded-2xl transition-all duration-200 cursor-pointer
                            ${isDanger ? "text-[#DC3545] hover:bg-[#DC3545]/10" : ""}
                        `}
                    >
                        {confirmText}
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};
