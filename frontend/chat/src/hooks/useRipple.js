import { useEffect, useState } from "react";

export const useRipple = () => {
    const [ripples, setRipples] = useState([]);

    const createRipple = (event) => {
        const element = event.currentTarget;
        const rect = element.getBoundingClientRect();

        const size = Math.max(rect.width, rect.height);

        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const newRipple = {
            id: Date.now() + Math.random(),
            x,
            y,
            size
        };

        setRipples((prevRipples) => [...prevRipples, newRipple]);
    };

    useEffect(() => {
        if (ripples.length === 0) return;

        const timeout = setTimeout(() => {
            setRipples([]);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [ripples]);

    return { ripples, createRipple };
};
