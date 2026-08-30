import { useEffect, useState } from "react"

export const useContextMenuAnimation = (isOpen, isMeasuring) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [animationClass, setAnimationClass] = useState("closed");

    useEffect(() => {
        if (isOpen && isMeasuring) {
            setShouldRender(true);
            setAnimationClass("measuring");
            return;
        }

        if (isOpen && !isMeasuring) {
            setShouldRender(true);
            setAnimationClass("closed");

            const raf = requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimationClass("open");
                });
            });
            return () => cancelAnimationFrame(raf);
        } 

        if (!isOpen) {
            setAnimationClass("closed");

            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 150);

            return () => clearTimeout(timer);
        }
    }, [isOpen, isMeasuring]);

    return { shouldRender, animationClass };
};
