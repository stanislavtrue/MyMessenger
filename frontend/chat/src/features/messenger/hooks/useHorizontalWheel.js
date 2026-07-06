import { useEffect, useRef } from "react"

export const useHorizontalWheel = (speed = 0.5) => {
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const handleWheel = (e) => {
            e.preventDefault();
            element.scrollLeft += (e.deltaX || e.deltaY) * speed;
        };

        element.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            element.removeEventListener("wheel", handleWheel);
        };
    }, [speed]);

    return elementRef;
}
