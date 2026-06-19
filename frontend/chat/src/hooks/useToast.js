import { useEffect, useRef, useState } from "react"

export const useToast = () => {
    const [toast, setToast] = useState(null);
    const toastTimeoutRef = useRef(null);

    const showToast = (text) => {
        clearTimeout(toastTimeoutRef.current);
        setToast({ id: Date.now(), text });

        toastTimeoutRef.current = setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    useEffect(() => {
        return () => clearTimeout(toastTimeoutRef.current);
    }, []);

    return { toast, showToast };
};
