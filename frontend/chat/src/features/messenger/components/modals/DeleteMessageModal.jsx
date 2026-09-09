import { useEffect, useState } from "react";
import { useModalAnimation } from "../../hooks/modal/useModalAnimation"
import { ModalWrapper } from "./ModalWrapper";

export const DeleteMessageModal = ({ isOpen, onClose, onConfirm }) => {
    const [forEveryone, setForEveryone] = useState(true);
    const { isClosing, handleClose } = useModalAnimation(isOpen, onClose);

    useEffect(() => {
        if (isOpen)
            setForEveryone(true);
    }, [isOpen]);

    const handleConfirm = () => {
        handleClose(() => onConfirm(forEveryone));
    };

    return (
        <ModalWrapper isOpen={isOpen} isClosing={isClosing} onClose={() => handleClose}>
            <div className={`
                flex flex-col gap-2 w-90 pt-2! bg-[#1C1C1C] rounded-[40px] select-none
                shadow-[0px_0px_5px_rgba(0,0,0,0.8)] border-r! border-l! border-[#2C2C2C]!
                ${isClosing ? "animate-modal-out" : "animate-modal-in"}
            `}>
                <div className="flex flex-col gap-3 px-6! py-4!">
                    <span className="text-lg! font-semibold!">Delete message</span>
                    <span className="text-smleading-normal">Are you sure you want to delete this message?</span>
                </div>

                <label className="flex items-center gap-3 mx-2! cursor-pointer select-none px-3! py-3! hover:bg-[#212121] rounded-2xl">
                    <input
                        type="checkbox"
                        checked={forEveryone}
                        onChange={(e) => setForEveryone(e.target.checked)}
                        className="w-5 h-5 rounded accent-[#527AFF] cursor-pointer mx-2!"
                    />
                    <span className="text-sm transition-colors">
                        Delete for everyone
                    </span>
                </label>

                <div className="flex justify-end gap-2 font-medium! text-sm px-6! pb-3!">
                    <button 
                        onClick={() => handleClose()}
                        className="px-3! py-2! rounded-2xl text-[#527AFF]! hover:bg-[#527AFF]/10! transition-all duration-200 cursor-pointer"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-3! py-2! rounded-2xl text-[#DC3545]! hover:bg-[#DC3545]/10! transition-all duration-200 cursor-pointer"
                    >
                        DELETE
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}
