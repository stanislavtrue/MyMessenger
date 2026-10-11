import { useCallback, useEffect, useRef } from "react"

export const useAutoScroll = () => {
    const bottomRef = useRef(null);

    const scrollToBottom = useCallback((behavior = "smooth") => {
        bottomRef.current?.scrollIntoView({ behavior });
    }, []);

    return { bottomRef, scrollToBottom };
};
