import { useEffect, useRef, useState } from "react"

export const useHighlightMessage = () => {
    const [highlightMsgId, setHighlightMsgId] = useState(null);
    const highlightTimeoutRef = useRef();

    const triggerHighlight = (messageId) => {
        if (highlightTimeoutRef.current) {
            clearTimeout(highlightTimeoutRef.current);
        }

        setHighlightMsgId(messageId);
        highlightTimeoutRef.current = setTimeout(() => {
            setHighlightMsgId(null);
        }, 2000);
    };

    useEffect(() => {
        return () => clearTimeout(highlightTimeoutRef.current);
    }, []);

    return { highlightMsgId, setHighlightMsgId, triggerHighlight };
};
