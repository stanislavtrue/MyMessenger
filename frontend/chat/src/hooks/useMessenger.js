import { useEffect, useState } from "react"
import { mockChats } from "../data/mockChats"
import { formatTime } from "../utils/formatTime";

export const useMessenger = () => {
    const [chats, setChats] = useState(mockChats);
    const [selectedChatId, setSelectedChatId] = useState(null);
    
    const selectedChat = chats.find(
        chat => chat.id === selectedChatId
    );

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape" && document.activeElement.tagName !== "INPUT") {
                setSelectedChatId(null);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
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
        setSelectedChatId,
        handleSendMessage
    };
};
