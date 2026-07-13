import { useMemo } from "react"

export const useSidebarSearch = (chats, sidebarSearchText, isContactsMode) => {
    const contacts = chats;
    
    const activeChats = useMemo(() => {
        return chats.filter(chat => chat.messages && chat.messages.length > 0);
    }, [chats]);

    const searchResults = useMemo(() => {
        const query = sidebarSearchText.toLowerCase().trim().replace(/^@/, "");

        if (isContactsMode) {
            if (!query) return { filteredChats: [], filteredContacts: contacts, filteredMessages: [] };

            const filteredContacts = chats.filter(chat => {
                const user = chat?.user;
                if (!user) return false;
                return user.displayName?.toLowerCase().includes(query) || user.username?.toLowerCase().includes(query);
            });

            return { filteredChats: [], filteredContacts, filteredMessages: [] };
        } 

        if (!query) {
            return { filteredChats: chats, filteredContacts: [], filteredMessages: [] };
        }

        const filteredChats = chats.filter(chat => 
            chat.user?.displayName?.toLowerCase().includes(query) || chat.user?.username?.toLowerCase().includes(query)
        );

        const filteredContacts = chats.filter(chat => 
            chat.user?.displayName?.toLowerCase().includes(query) || chat.user?.username?.toLowerCase().includes(query)
        );

        const filteredMessages = [];
        chats.forEach(chat => {
            if (chat.messages && Array.isArray(chat.messages)) {
                chat.messages.forEach(msg => {
                    if (msg.text?.toLowerCase().includes(query)) {
                        filteredMessages.push({
                            ...msg,
                            chatId: chat.id,
                            chatUser: chat.user
                        });
                    }
                });
            }
        });

        return {
            filteredChats,
            filteredContacts,
            filteredMessages
        };
    }, [chats, isContactsMode, sidebarSearchText, contacts]);

    return {
        activeChats,
        contacts,
        ...searchResults 
    };
};
