import { useEffect, useState } from "react"

export const useContextMenuAnimation = (isOpen, isMeasuring) => {
    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            return;
        }
        const timer = setTimeout(() => {
            setShouldRender(false);
        }, 120);

        return () => clearTimeout(timer);
    }, [isOpen]);

    let animationClass = "closed";
    if (isOpen) {
        animationClass = isMeasuring ? "measuring" : "open";
    }

    return { shouldRender, animationClass };
};
