import { useState } from "react"
import { sortChats } from "../utils/sortChats";

export const useSidebarSearch = (chats) => {
    const [searchText, setSearchText] = useState("");

    const sortedChats = useMemo(() => sortChats(chats), [chats]);

    const filteredChats = useMemo(() => 
        sortedChats.filter(chat => 
            chat.name.toLowerCase().includes(searchText.toLowerCase())
        ), [sortedChats, searchText]
    );

    return {
        searchText,
        setSearchText,
        sortedChats,
        filteredChats,
    };
};
