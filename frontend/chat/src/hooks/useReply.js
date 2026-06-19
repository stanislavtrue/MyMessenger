import { useEffect, useRef, useState } from "react"

export const useReply = () => {
    const [replyToMessage, setReplyToMessage] = useState(null);
    const [replyPreview, setReplyPreview] = useState(null);
    const replyTimeoutRef = useRef(null);

    const openReply = (message) => {
        clearTimeout(replyTimeoutRef.current);
        setReplyPreview(message);

        setTimeout(() => {
            setReplyToMessage(message);
        }, 0);
    };

    const closeReply = () => {
        setReplyToMessage(null);
        replyTimeoutRef.current = setTimeout(() => {
            setReplyPreview(null);
        }, 200);
    };

    useEffect(() => {
        return () => clearTimeout(replyTimeoutRef.current);
    }, []);

    return { replyToMessage, replyPreview, openReply, closeReply, setReplyToMessage };
};
