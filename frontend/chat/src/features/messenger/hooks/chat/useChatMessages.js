import { apiFetch } from "@/api/apiFetch";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { useCallback, useState } from "react";

export const useChatMessages = ({ setChats, currentUserId }) => {
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState({});

    const fetchMessages = useCallback(async (chatId) => {
        setIsLoadingMessages(true);

        try {
            const response = await apiFetch(`http://localhost:5079/api/messages/${chatId}`)

            if (!response.ok) {
                console.log(response.statusText);
                return;
            }

            const data = await response.json();

            console.log(data);

            setChats(prevChats => prevChats.map(chat => {
                if (chat.id === chatId) {
                    return {
                        ...chat,
                        messages: data.messages.map(msg => ({
                            ...msg,
                            isOwnMessage: msg.senderId === currentUserId,
                            isDeleted: msg.isDeleted,
                            time: formatTime(msg.sentAt),
                            date: formatDate(msg.sentAt),
                        }))
                    };
                }
                
                return chat;
            }));

            setHasMoreMessages(prev => ({
                ...prev,
                [chatId]: {
                    hasMore: data.hasMore,
                    nextCursor: data.nextCursor
                }
            }));
        } catch (error) {
            console.error("Error fetching messages: ", error);
        } finally {
            setIsLoadingMessages(false);
        }
    }, [currentUserId, setChats]);

    const fetchOlderMessages = useCallback(async (chatId) => {
        const page = hasMoreMessages[chatId];

        if (isLoadingOlderMessages || !page?.hasMore || !page?.nextCursor) 
            return;
        
        setIsLoadingOlderMessages(true);
        
        try {
            const response = await apiFetch(`http://localhost:5079/api/messages/${chatId}?beforeMessageId=${encodeURIComponent(page.nextCursor)}`);
            
            if (!response.ok) {
                console.log(response.statusText);
                return;
            }

            const data = await response.json();

            console.log(data);
            
            setChats(prevChats => prevChats.map(chat => {
                if (chat.id === chatId) {
                    const existingIds = new Set(
                        chat.messages.map(msg => msg.id)
                    );

                    const olderMessages = data.messages
                        .filter(msg => !existingIds.has(msg.id))
                        .map(msg => ({
                            ...msg,
                            isOwnMessage: msg.senderId === currentUserId,
                            isDeleted: msg.isDeleted,
                            time: formatTime(msg.sentAt),
                            date: formatDate(msg.sentAt),
                        }));

                    return {
                        ...chat,
                        messages: [...olderMessages, ...chat.messages],
                    };
                }
                
                return chat;
            }));
        
            setHasMoreMessages(prev => ({
                ...prev,
                [chatId]: {
                    hasMore: data.hasMore,
                    nextCursor: data.nextCursor
                }
            }));
        } catch (error) {
            console.error("Error fetching older messages: ", error);
        } finally {
            setIsLoadingOlderMessages(false);
        }
    }, [currentUserId, setChats, hasMoreMessages, isLoadingOlderMessages]);

    return {
        isLoadingMessages,
        isLoadingOlderMessages,
        hasMoreMessages,
        fetchMessages,
        fetchOlderMessages
    };
};
