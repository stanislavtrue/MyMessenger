import { useEffect, useState } from "react"

export const useChatSearch = (selectedChat, isChatSearchFocused, setIsChatSearchFocused) => {
    const [chatSearchText, setChatSearchText] = useState("");
    const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

    const filteredSearchMessages = selectedChat
        ? [...selectedChat.messages].filter(msg => 
            msg.text.toLowerCase().includes(chatSearchText.toLowerCase().trim()))
        .reverse()
    : [];

    const closeChatSearch = () => {
        setIsChatSearchFocused(false);
        setChatSearchText("");
        setCurrentSearchIndex(0);
    };

    const handlePrevSearch = () => {
        if (filteredSearchMessages.length === 0) return;
        setCurrentSearchIndex(prev => 
            prev === 0 ? filteredSearchMessages.length - 1 : prev - 1
        );
    };

    const handleNextSearch = () => {
        if (filteredSearchMessages.length === 0) return;
        setCurrentSearchIndex(prev => (prev + 1) % filteredSearchMessages.length);
    };

    useEffect(() => {
        setChatSearchText("");
        setCurrentSearchIndex(0)
    }, [selectedChat?.id]);

    return {
        chatSearchText,
        setChatSearchText,
        filteredSearchMessages,
        currentSearchIndex,
        setCurrentSearchIndex,
        closeChatSearch,
        handlePrevSearch,
        handleNextSearch
    }
}
