import { useState } from "react"

export const useSidebarSearch = (chats) => {
    const [searchText, setSearchText] = useState("");
    const [isContactsMode, setIsContactsMode] = useState(false);

    const activeChats = useMemo(() => {
        return chats.filter(chat => chat.messages && chat.messages.length > 0);
    }, [chats]);

    const contacts = useMemo(() => chats, [chats]);

    const filteredResults = useMemo(() => {
        const query = searchText.toLowerCase();
        if (!query) return [];
        if (isContactsMode) {
            return contacts.filter(c => c.name?.toLowerCase().includes(query));
        } else {
            return activeChats.filter(c => c.name?.toLowerCase().includes(query));
        }
    }, [searchText, isContactsMode, activeChats, contacts]);

    return {
        searchText,
        setSearchText,
        isContactsMode,
        setIsContactsMode,
        activeChats,
        contacts,
        filteredResults
    };
};
