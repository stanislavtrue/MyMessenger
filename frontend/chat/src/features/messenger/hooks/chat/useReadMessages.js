import { useEffect, useRef } from "react"

export const useReadMessages = (messages, chatId, messagesContainerRef, onMarkAsRead, isReadTrackingEnabled) => {
    const lastReadRef = useRef({
        messageId: null
    });
        
    const onMarkAsReadRef = useRef(onMarkAsRead);
    
    useEffect(() => {
        onMarkAsReadRef.current = onMarkAsRead;
    }, [onMarkAsRead]);

    useEffect(() => {
        lastReadRef.current = {
            messageId: null
        };
    }, [chatId]);

    useEffect(() => {
        if (!isReadTrackingEnabled || !chatId || !messages.length)
            return;
    }, [messages, chatId, messagesContainerRef, isReadTrackingEnabled]);
    
    useEffect(() => {
        if (!chatId || !messages.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleMessages = entries
                    .filter(entry => entry.isIntersecting)
                    .filter(entry => entry.target.getAttribute("data-is-own") !== "true")
                    .map(entry => {
                        const messageId = entry.target.getAttribute("data-message-id");

                        return {
                            messageId,
                            index: messages.findIndex(message => String(message.id) === messageId)
                        };
                    })
                    .filter(message => message.index !== -1);

                if (!visibleMessages.length)
                    return;
                
                const lastVisibleMessage = visibleMessages
                    .reduce((last, current) => current.index > last.index  
                        ? current
                        : last
                    );

                const previousReadIndex = lastReadRef.current.messageId
                    ? messages.findIndex(message => String(message.id) === String(lastReadRef.current.messageId))
                    : -1;

                if (lastVisibleMessage.index <= previousReadIndex) 
                    return;

                lastReadRef.current = {
                    messageId: lastVisibleMessage.messageId
                };

                onMarkAsReadRef.current(chatId, lastVisibleMessage.messageId);
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
