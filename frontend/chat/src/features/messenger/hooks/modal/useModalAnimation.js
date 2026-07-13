import { useEffect, useState } from "react"

export const useModalAnimation = (isOpen, onClose) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) setIsClosing(false);
    }, [isOpen]);

    const handleClose = (callback) => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            if (callback) callback();
        }, 150);
    };

    return { isClosing, handleClose };
};
