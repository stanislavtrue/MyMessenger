import { useEffect, useState } from "react"
import { mockChats } from "../data/mockChats"
import { formatTime } from "../utils/formatTime";
import { formatDate } from "../utils/formatDate";

export const useMessenger = () => {
    const [chats, setChats] = useState(mockChats);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [sidebarWidth, setSidebarWidth] = useState(33);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    const selectedChat = chats.find(chat => chat.id === selectedChatId);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        const handleEscape = (event) => {
            if (event.key === "Escape" && document.activeElement.tagName !== "INPUT") {
                setSelectedChatId(null);
            }
        };

        window.addEventListener("resize", handleResize);
        document.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {

            setChats(prevChats => {
                const inactiveChats = chats.filter(c => c.id !== selectedChatId);
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
        }, 10000);

        return () => clearInterval(interval);
    }, [selectedChatId, chats]);

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);

        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === chatId) {
                return {
                    ...chat,
                    unreadCount: 0,
                    messages: chat.messages.map(msg => ({
                        ...msg,
                        status: "read"
                    }))
                };
            }
            
            return chat;
        }));
    };

    const handleSendMessage = (text) => {
        if (!text.trim() || !selectedChatId) return;

        const messageId = Date.now();

        const newMessage = {
            id: messageId,
            text,
            time: formatTime(),
            date: formatDate(),
            isOwnMessage: true,
            status: "sent"
        };
        
        setChats(prevChats => prevChats.map(chat => {
                if (chat.id === selectedChatId) {
                    return {
                        ...chat,
                        lastMessage: text,
                        time: formatTime(),
                        messages: [...chat.messages, newMessage]
                    };
                }

                return chat;
            })
        );
        setTimeout(() => {
            const friendMessage = {
                id: Date.now() + 1,
                text: "Hello!",
                time: formatTime(),
                date: formatDate(),
                isOwnMessage: false,
                status: "sent"
            };

            setChats(prevChats => prevChats.map(chat => {
                if (chat.id === selectedChatId) {
                    return {
                        ...chat,
                        lastMessage: friendMessage.text,
                        time: formatTime(),
                        unreadCount: 0,
                        messages: [...chat.messages, friendMessage]
                    };
                }
                
                return chat;
            }));
        }, 3000);
    };

    return {
        chats,
        selectedChat,
        selectedChatId,
        sidebarWidth,
        windowWidth,
        setSidebarWidth,
        setSelectedChatId: handleSelectChat,
        handleSendMessage
    };
};
