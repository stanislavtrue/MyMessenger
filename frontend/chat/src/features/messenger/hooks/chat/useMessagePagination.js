import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export const useMessagePagination = (scrollContainerRef, chatId, isLoadingOlderMessages, hasMoreMessages, fetchOlderMessages, messages, scrollToBottom) => {
    const scrollAnchorRef = useRef(null);
    const loadingOlderRef = useRef(false);
    const isInitialMount = useRef(true);

    const saveScrollAnchor = useCallback(() => {
        const container = scrollContainerRef?.current;
        if (!container)
            return;

        const containerTop = container.getBoundingClientRect().top;
        const messageElements = container.querySelectorAll("[data-message-id]");

        for (const element of messageElements) {
            const rect = element.getBoundingClientRect();

            if (rect.bottom > containerTop) {
                scrollAnchorRef.current = {
                    chatId: chatId,
                    messageId: element.dataset.messageId,
                    offset: rect.top - containerTop,
                };

                return;
            }
        }
    }, [scrollContainerRef, chatId]);
    
    const handleScroll = useCallback(async () => {
        const container = scrollContainerRef?.current;

        if (isInitialMount.current || loadingOlderRef.current || isLoadingOlderMessages || !container || container.scrollTop > 10) 
            return;

        const page = hasMoreMessages?.[chatId];
        if (!page?.hasMore || !page?.nextCursor)
            return;

        loadingOlderRef.current = true;
        saveScrollAnchor();

        try {
            await fetchOlderMessages(chatId);
        } catch (error) {
            scrollAnchorRef.current = null;
            console.error("Error loading older messages: ", error);
        } finally {
            loadingOlderRef.current = false;
        }
    }, [scrollContainerRef, hasMoreMessages, fetchOlderMessages, chatId, isLoadingOlderMessages, saveScrollAnchor]);

    useLayoutEffect(() => {
        const container = scrollContainerRef?.current;
        const anchor = scrollAnchorRef?.current;

        if (container && anchor && anchor.chatId === chatId) {
            const element = Array
                .from(container.querySelectorAll("[data-message-id]"))
                .find(el => el.dataset.messageId === String(anchor.messageId));

            if (element) {
                const containerTop = container.getBoundingClientRect().top;
                const newOffset = element.getBoundingClientRect().top - containerTop;

                container.scrollTop += newOffset - anchor.offset;
            }

            scrollAnchorRef.current = null;
        }

        isInitialMount.current = false;
    }, [messages, chatId, scrollContainerRef]);

    useEffect(() => {
        const container = scrollContainerRef?.current;
        if (!container) 
            return;

        container.addEventListener("scroll", handleScroll, { passive: true });
        
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [scrollContainerRef, handleScroll]);

    useEffect(() => {
        isInitialMount.current = true;

        const timer = setTimeout(() => {
            scrollToBottom("auto");
        }, 0);

        return () => clearTimeout(timer);
    }, [chatId, scrollToBottom]);
};
