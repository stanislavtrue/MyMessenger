import { useEffect } from "react";
import { formatTime } from "../utils/formatTime";
import { formatDate } from "../utils/formatDate";

export const useMockIncomingMessages = (setChats, selectedChatId) => {
    useEffect(() => {
        const interval = setInterval(() => {
            setChats(prevChats => {
                const inactiveChats = prevChats.filter(c => c.id !== selectedChatId);
                if (inactiveChats.length === 0) return prevChats;

                const randomChat = inactiveChats[Math.floor(Math.random() * inactiveChats.length)];
                
                const spamMessage = {
                    id: Date.now(),
                    text: "It`s spam!!! I'll ddos you!!!",
                    time: formatTime(),
                    date: formatDate(),
                    isOwnMessage: false,
                    status: "sent"
                };
                
                return prevChats.map(chat => {
                    if (chat.id === randomChat.id) {
                        return {
                            ...chat,
                            lastMessage: spamMessage.text,
                            time: formatTime(),
                            unreadCount: (chat.unreadCount || 0) + 1,
                            messages: [...chat.messages, spamMessage]
                        };
                    }
                    return chat;
                });
            });
        }, 30000); 

        return () => clearInterval(interval);
    }, [selectedChatId, setChats]);
};
