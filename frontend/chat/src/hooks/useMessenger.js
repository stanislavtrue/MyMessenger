import { useEffect, useState } from "react"
import { mockChats } from "../data/mockChats"
import { formatTime } from "../utils/formatTime";

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

    const handleSendMessage = (text) => {
        const newMessage = {
            id: Date.now(),
            text,
            time: formatTime(),
            isOwnMessage: true
        };
        
        setChats(prevChats => 
            prevChats.map(chat => {
                if (chat.id === selectedChatId) {
                    return {
                        ...chat,
                        lastMessage: text,
                        messages: [...chat.messages, newMessage]
                    };
                }

                return chat;
            })
        );
    };

    return {
        chats,
        selectedChat,
        selectedChatId,
        sidebarWidth,
        windowWidth,
        setSidebarWidth,
        setSelectedChatId,
        handleSendMessage
    };
};
