import { apiFetch } from "@/api/apiFetch";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { useCallback, useState } from "react";

export const useChatMessages = ({ setChats, currentUserId, closeReply, replyToMessage }) => {
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    const fetchMessages = useCallback(async (chatId) => {
        setIsLoadingMessages(true);
        try {
            const response = await apiFetch(`http://localhost:5079/api/messages/${chatId}`)

            if (!response.ok) {
                console.log(response.statusText);
                return;
            }

            const messages = await response.json();

            setChats(prevChats => prevChats.map(chat => {
                if (chat.id === chatId) {
                    return {
                        ...chat,
                        messages: messages.map(msg => ({
                            ...msg,
                            isOwnMessage: msg.senderId === currentUserId,
                            time: formatTime(msg.sentAt),
                            date: formatDate(msg.sentAt),
                        }))
                    };
                }
                
                return chat;
            }));
        } catch (error) {
            console.error("Error fetching messages: ", error);
        } finally {
            setIsLoadingMessages(false);
        }
    }, [currentUserId, setChats]);

    const handlePinMessage = useCallback((chatId, message) => {
        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === chatId) {
                const pinnedMessages = chat.pinnedMessages || [];

                if (pinnedMessages.some(msg => msg.id === message.id)) return chat;

                const updatedMessages = chat.messages.map(msg => 
                    msg.id === message.id ? { ...msg, isPinned: true } : msg
                );

                return {
                    ...chat,
                    messages: updatedMessages,
                    pinnedMessages: [...pinnedMessages, { ...message, isPinned: true }] 
                };
            }

            return chat;
        }));
    }, [setChats]);

    const handleUnpinMessage = useCallback((chatId, messageId) => {
        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === chatId) {
                const pinnedMessages = chat.pinnedMessages || [];

                const updatedMessages = chat.messages.map(msg =>
                    msg.id === messageId ? { ...msg, isPinned: false } : msg
                );

                return {
                    ...chat,
                    messages: updatedMessages,
                    pinnedMessages: pinnedMessages.filter(msg => msg.id !== messageId) 
                };
            }

            return chat;
        }));
    }, [setChats]);

    const handleDeleteMessage = useCallback((chatId, messageId) => {
        setChats(prevChats => prevChats.map(chat => {
                if (chat.id === chatId) {
                    const updatedMessages = chat.messages.filter(msg => msg.id !== messageId);
                    const nextLastMessage = updatedMessages.at(-1);

                    if (replyToMessage?.id === messageId) {
                        closeReply();
                    }

                    const pinnedMessages = chat.pinnedMessages || [];

                    return {
                        ...chat,
                        lastMessage: nextLastMessage ? nextLastMessage.text : "No messages yet",
                        time: nextLastMessage ? nextLastMessage.time : "",
                        messages: updatedMessages,
                        pinnedMessages: pinnedMessages.filter(msg => msg.id !== messageId)
                    };
                }

                return chat;
            }));
    }, [setChats, replyToMessage, closeReply]);

    return {
        isLoadingMessages,
        fetchMessages,
        handlePinMessage,
        handleUnpinMessage,
        handleDeleteMessage
    };
};
