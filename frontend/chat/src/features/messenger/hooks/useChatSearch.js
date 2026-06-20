import { useEffect, useState } from "react"

export const useChatSearch = (selectedChat, isChatSearchFocused, setIsChatSearchFocused) => {
    const [searchText, setSearchText] = useState("");
    const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

    const filteredSearchMessages = selectedChat
        ? [...selectedChat.messages].filter(msg => 
            msg.text.toLowerCase().includes(searchText.toLowerCase().trim()))
        .reverse()
    : [];

    const closeChatSearch = () => {
        setIsChatSearchFocused(false);
        setSearchText("");
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
        setSearchText("");
        setCurrentSearchIndex(0)
    }, [selectedChat?.id]);

    return {
        searchText,
        setSearchText,
        filteredSearchMessages,
        currentSearchIndex,
        setCurrentSearchIndex,
        closeChatSearch,
        handlePrevSearch,
        handleNextSearch
    }
}
