import { useEffect, useRef } from "react"

export const useReadMessages = (messages, chatId, messagesContainerRef, onMarkAsRead) => {
    const lastReadRef = useRef({
        index: -1,
        messageId: null
    });
        
    const onMarkAsReadRef = useRef(onMarkAsRead);
    
    useEffect(() => {
        onMarkAsReadRef.current = onMarkAsRead;
    }, [onMarkAsRead]);

    useEffect(() => {
        lastReadRef.current = {
            index: -1,
            messageId: null
        };
    }, [chatId]);

    useEffect(() => {
        if (!chatId || !messages.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleMessages = entries
                    .filter(entry => entry.isIntersecting)
                    .filter(entry => entry.target.getAttribute("data-is-own") !== "true");

                const visibleWithIndexes = visibleMessages
                    .map(entry => {
                        const messageId = entry.target.getAttribute("data-message-id");

                        return {
                            messageId,
                            index: messages.findIndex(message => message.id === messageId)
                        };
                    });

                if (!visibleWithIndexes.length)
                    return;
                
                const lastVisibleMessage = visibleWithIndexes
                    .reduce((last, current) => {
                        if (current.index > last.index) 
                            return current;

                        else return last;
                    });

                if (lastVisibleMessage.index > lastReadRef.current.index) {
                    lastReadRef.current = {
                        index: lastVisibleMessage.index,
                        messageId: lastVisibleMessage.messageId
                    };

                    onMarkAsReadRef.current(chatId, lastVisibleMessage.messageId);
                }

                console.log(lastReadRef.current.index);
            },
            {
                threshold: 0.5,
            }
        );

        const elements = messagesContainerRef.current?.querySelectorAll("[data-message-id]");
        elements?.forEach((el) => observer.observe(el));

        return () => {
            observer.disconnect();
        };
    }, [messages, chatId, messagesContainerRef]); 
};
