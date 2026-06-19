import { useEffect, useRef } from "react"

export const useAutoScroll = (dependecies) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, dependecies);
    
    return bottomRef;
};
