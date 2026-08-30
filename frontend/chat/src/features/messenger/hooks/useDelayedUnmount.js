import { useEffect, useState } from "react";

export const useDelayedUnmount = (isOpen) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [animState, setAnimState] = useState("closed");

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setAnimState("closed");

            const raf = requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimState("open");
                });
            });

            return () => cancelAnimationFrame(raf);
        } else {
            setAnimState("closed");
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 150);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return { shouldRender, animState };
};
