import { apiFetch } from "@/api/apiFetch";
import { useCallback, useEffect, useState } from "react"

export const useChats = ({ setChats }) => {
    const [isLoadingChats, setIsLoadingChats] = useState(true);

    useEffect(() => {
        const getChats = async () => {
            try { 
                const response = await apiFetch("http://localhost:5079/api/chatrooms")

                if (!response.ok) {
                    console.log(response.statusText);
                    return;
                }
                
                const chats = await response.json();

                const formattedChats = chats.map(chat => ({
                    ...chat,
                    messages: [],
                }))

                setChats(formattedChats);
            } catch (error) {
                console.error("Error fetching chats: ", error);
            } finally {
                setIsLoadingChats(false);
            }
        };

        getChats();
    }, [setChats]);

    const handleAddContact = useCallback(({ firstName, lastName, username }) => {
        const newChatId = Date.now();

        const displayName = `${firstName} ${lastName}`.trim();

        const newChat = {
            id:newChatId,
            user: {
                id: `user_${username.toLowerCase()}`,
                displayName: displayName,
                username: username.replace("@", "").toLowerCase(),
                avatar: null,
                status: "offline",
            },
            lastMessage: "",
            time: "",
            unreadCount: 0,
            messages: [],
        };

        setChats(prevChats => [newChat, ...prevChats]);
    }, [setChats]);

    return { isLoadingChats, handleAddContact };
};
