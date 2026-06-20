import { useEffect, useRef } from "react"

export const useEmojiPickerHover = (IsEmojiPickerOpen, setIsEmojiPickerOpen) => {
    const hidePickerTimeout = useRef(null);
    const showPickerTimeout = useRef(null);

    const handleMouseEnter = () => {
        clearTimeout(hidePickerTimeout.current);
        showPickerTimeout.current = setTimeout(() => {
            setIsEmojiPickerOpen(true);
        }, 100);
    };

    const handleMouseLeave = () => {
        clearTimeout(showPickerTimeout.current);
        hidePickerTimeout.current = setTimeout(() => {
            setIsEmojiPickerOpen(false);
        }, 300);
    };

    useEffect(() => {
        return () => {
            clearTimeout(hidePickerTimeout.current);
            clearTimeout(showPickerTimeout.current);
        };
    }, []);

    return { handleMouseEnter, handleMouseLeave };
};
