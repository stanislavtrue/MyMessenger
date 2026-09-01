import { useCallback, useEffect, useState } from "react"
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";

import { useChatSearch } from "./chat/useChatSearch";
import { useToast } from "../../../hooks/useToast";
import { useMessengerKeyboard } from "./useMessengerKeyboard";
import { useContextMenu } from "./contextMenu/useContextMenu";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useHighlightMessage } from "./chat/useHighlightMessage";
import { useReply } from "./chat/useReply";
import connection from "../services/chatHub";
import { apiFetch } from "@/api/apiFetch";
import { MESSAGE_STATUS } from "../constants/messageBubbleStatus";

export const useMessenger = () => {
    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [sidebarWidth, setSidebarWidth] = useState(33);
    const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);
    const [isSidebarSearchFocused, setIsSidebarSearchFocused] = useState(false);
    const [isChatSearchFocused, setIsChatSearchFocused] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [sidebarSearchText, setSidebarSearchText] = useState("");
    const [isContactsMode, setIsContactsMode] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isAddContactOpen, setIsAddContactOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    const windowWidth = useWindowWidth();
    const { toast, showToast } = useToast();
    const { replyToMessage, replyPreview, openReply, closeReply, setReplyToMessage } = useReply()
    const { highlightMsgId, setHighlightMsgId, triggerHighlight } = useHighlightMessage();
    const { contextMenu, setContextMenu, showMenu, closeMenu } = useContextMenu();

    const selectedChat = chats.find(chat => chat.id === selectedChatId);
    const chatSearch = useChatSearch(selectedChat, isChatSearchFocused, setIsChatSearchFocused);

    const closeSidebarSearch = () => {
        setIsSidebarSearchFocused(false);
        setIsContactsMode(false);
        setSidebarSearchText("");
    };

    const closeConfirmModal = () => setIsConfirmModalOpen(false);
    const closeAddContact = () => setIsAddContactOpen(false);

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const response = await apiFetch("http://localhost:5079/api/auth/me");

                if (!response.ok) {
                    console.log(response.statusText);
                    return;
                }

                const user = await response.json();

                setCurrentUser({
                    id: user.id,
                    displayName: user.displayName,
                    username: user.username,
                    avatar: user.avatarUrl,
                    isOnline: user.isOnline,
                    lastSeenAt: user.lastSeenAt
                });
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingUser(false);
            }
        };

        getCurrentUser();
    }, [])

    useEffect(() => {
        const  startConnection = async () => {
            try {
                if (connection.state === "Disconnected") {
                    await connection.start();
                }
            } catch (error) {
                console.error("SignalR connection error: ", error);
            }
        };

        startConnection();
    }, []);

    useEffect(() => {
        const handleReceiveMessage = (message) => {
            const isOwn = message.senderId === currentUser.id;
            const newMessage = {
                id: message.id,
                text: message.text,
                time: formatTime(message.sentAt),
                date: formatDate(message.sentAt),
                isOwnMessage: isOwn,
                status: message.status,
                replyTo: null
            };

            setChats(prevChats => prevChats.map(chat => {
                if (chat.id === message.chatId) {
                    return {
                        ...chat,
                        messages: [...chat.messages, newMessage]
                    };
                }

                return chat;
            }));
        };       

        const handleChatUpdated = ({ chatId, lastMessage, lastMessageAt, unreadCount }) => {
            setChats((prevChats) => {
                const chatIndex = prevChats.findIndex((chat) => chat.id === chatId);

                if (chatIndex === -1) 
                    return prevChats;

                const existingChat = prevChats[chatIndex];

                const updatedChat = {
                    ...existingChat,
                    lastMessage: lastMessage,
                    lastMessageAt: lastMessageAt,
                    unreadCount: unreadCount !== undefined ? unreadCount : existingChat.unreadCount
                };

                const newChat = [
                    updatedChat,
                    ...prevChats.filter((chat) => chat.id !== chatId)
                ];

                return newChat;
            });
        };

        const handleMessagesRead = ({ chatId, userId, lastReadMessageId, unreadCount }) => {
            setChats(prevChats => prevChats.map(chat => {
                if (chat.id !== chatId) return chat;

                const lastReadIndex = chat.messages.findIndex(
                    message => message.id === lastReadMessageId
                );

                return {
                    ...chat,
                    ...(userId === currentUser.id && { unreadCount: unreadCount ?? 0 }),
                    messages: chat.messages.map((message, index) => {
                        if (message.isOwnMessage && lastReadIndex !== -1 && index <= lastReadIndex) {
                            return {
                                ...message,
                                status: MESSAGE_STATUS.READ
                            };
                        }

                        return message;
                    })
                };
            }));
        };

        const handleUserStatusChanged = ({ userId, isOnline, lastSeenAt }) => {
            setChats(prevChats => prevChats.map(chat => {
                if (chat.user.id === userId) {
                    return {
                        ...chat,
                        user: {
                            ...chat.user,
                            isOnline: isOnline,
                            lastSeenAt: lastSeenAt
                        }
                    };
                }

                return chat;
            }));
        };

        const handleUserStartTyping = ({ chatId, userId }) => {
            setChats(prevChats => prevChats.map(chat => {
                if (chat.id === chatId) {
                    return {
                        ...chat,
                        typingUserId: userId
                    };
                }

                return chat;
            }));
        };

        const handleUserStopTyping = ({ chatId, userId }) => {
            setChats(prevChats => prevChats.map(chat => {
                if (chat.id === chatId) {
                    return {
                        ...chat,
                        typingUserId: null
                    };
                }
                
                return chat;
            }));
        };

        connection.on("ReceiveMessage", handleReceiveMessage);
        connection.on("ChatUpdated", handleChatUpdated);
        connection.on("MessagesRead", handleMessagesRead);
        connection.on("UserStatusChanged", handleUserStatusChanged);
        connection.on("UserStartTyping", handleUserStartTyping);
        connection.on("UserStopTyping", handleUserStopTyping);

        return () => {
            connection.off("ReceiveMessage", handleReceiveMessage);
            connection.off("ChatUpdated", handleChatUpdated);
            connection.off("MessagesRead", handleMessagesRead);
            connection.off("UserStatusChanged", handleUserStatusChanged);
            connection.off("UserStartTyping", handleUserStartTyping);
            connection.off("UserStopTyping", handleUserStopTyping);
        };
    }, [currentUser?.id, connection]);

    useEffect(() => {
        const getChats = async () => {
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

            console.log("Formatted chats:", formattedChats)
            console.log("Chats state:", chats);

            setChats(formattedChats);
        }

        getChats();

    }, []);

    const markAsRead = async (chatId, messageId) => {
        try {
            await connection.invoke("MarkMessageAsRead", chatId, messageId);
        } catch (error) {
            console.error("Error marking message as read: ", error);
        }
    };

    const handleAddContact = ({ firstName, lastName, username }) => {
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
        closeAddContact();
    };

    const handleSetReaction = (messageId, emoji) => {
        setChats((prevChats) =>
            prevChats.map((chat) => {
                if (chat.id !== selectedChatId) return chat;

                const updatedMessages = chat.messages.map((msg) => {
                    if (msg.id !== messageId) return msg;

                    const currentReactions = msg.reactions || [];

                    const existingReactionIndex = currentReactions.findIndex(
                        (r) => r.userId === currentUser.id
                    );

                    let updatedReactions = [...currentReactions];

                    if (existingReactionIndex !== -1) {
                        const existingReaction = currentReactions[existingReactionIndex];

                        if (existingReaction.emoji === emoji) {
                            updatedReactions = updatedReactions.filter(
                                (r) => r.userId !== currentUser.id
                            );
                        } else {
                            updatedReactions[existingReactionIndex] = {
                                emoji,
                                userId: currentUser.id
                            };
                        }
                    } else {
                        updatedReactions.push({
                            emoji,
                            userId: currentUser.id
                        });
                    }

                    return {
                        ...msg,
                        reactions: updatedReactions
                    };
                });

                return {
                    ...chat,
                    messages: updatedMessages,
                };
            })
        );
    };

    const handleSelectChat = async (chatId) => {
        closeMenu();
        setSelectedChatId(chatId);

        const response = await apiFetch(`http://localhost:5079/api/messages/${chatId}`)

        if (!response.ok) {
            console.log(response.statusText);
            return;
        }

        const messages = await response.json();

        console.log(messages);

        setIsChatSearchFocused(false);
        if (chatSearch?.setChatSearchText) {
            chatSearch.setChatSearchText("");
        }

        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === chatId) {
                return {
                    ...chat,
                    messages: messages.map(msg => ({
                        ...msg,
                        isOwnMessage: msg.senderId === currentUser.id,
                        time: formatTime(msg.sentAt),
                        date: formatDate(msg.sentAt),
                    }))
                };
            }
            
            return chat;
        }));
    };

    useEffect(() => {
        if (!selectedChatId) return;

        const joinChat = async () => {
            try {
                if (connection.state !== "Connected") {
                    console.log("SignalR isn't connected yet");
                    return;
                }

                await connection.invoke("JoinChat", selectedChatId);
            } catch (error) {
                console.log("JoinChat error: ", error);
            }
        };

        joinChat();
    }, [selectedChatId]);

    const handlePinMessage = (chatId, message) => {
        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === chatId) {
                const pinnedMessages = chat.pinnedMessages || [];

                if (pinnedMessages.some(msg => msg.id === message.id)) return chat;

                const updatedMessages = chat.messages.map(msg => 
                    msg.id === message.id ? { ...msg, isPinned: true } : msg
                );

                return {
                    ...chat,
                    messages: updatedMessages,
                    pinnedMessages: [...pinnedMessages, { ...message, isPinned: true }] 
                };
            }

            return chat;
        }));
    };

    const handleUnpinMessage = (chatId, messageId) => {
        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === chatId) {
                const pinnedMessages = chat.pinnedMessages || [];

                const updatedMessages = chat.messages.map(msg =>
                    msg.id === messageId ? { ...msg, isPinned: false } : msg
                );

                return {
                    ...chat,
                    messages: updatedMessages,
                    pinnedMessages: pinnedMessages.filter(msg => msg.id !== messageId) 
                };
            }

            return chat;
        }));
    };

    const handleDeleteMessage = (chatId, messageId) => {
        setChats(prevChats => 
            prevChats.map(chat => {
                if (chat.id === chatId) {
                    const updatedMessages = chat.messages.filter(msg => msg.id !== messageId);
                    const nextLastMessage = updatedMessages.at(-1);

                    if (replyToMessage?.id === messageId) {
                        closeReply();
                    }

                    const pinnedMessages = chat.pinnedMessages || [];

                    return {
                        ...chat,
                        lastMessage: nextLastMessage ? nextLastMessage.text : "No messages yet",
                        time: nextLastMessage ? nextLastMessage.time : "",
                        messages: updatedMessages,
                        pinnedMessages: pinnedMessages.filter(msg => msg.id !== messageId)
                    };
                }

                return chat;
            })
        );
    };

    const handleSendMessage = async (text) => {
        if (!text.trim() || !selectedChatId) return;

        try {
            await connection.invoke(
                "SendMessage",
                selectedChatId,
                text.trim()
            );

            closeReply();
        } catch (error) {
            console.log("Failed to send message: ", error);
        }
    }
   
    useMessengerKeyboard({
        contextMenuVisible: contextMenu.visible,
        closeMenu,
        isSidebarMenuOpen,
        setIsSidebarMenuOpen,
        isEmojiPickerOpen,
        setIsEmojiPickerOpen,
        isSidebarSearchFocused,
        setIsSidebarSearchFocused,
        closeSidebarSearch,
        isConfirmModalOpen,
        closeConfirmModal,
        isAddContactOpen,
        closeAddContact,
        isChatSearchFocused,
        closeChatSearch: chatSearch.closeChatSearch,
        replyToMessage,
        closeReply,
        selectedChatId,
        setSelectedChatId: handleSelectChat
    });

    return {
        currentUser,
        isLoadingUser,
        markAsRead,
        chats,
        selectedChat,
        selectedChatId,
        sidebarWidth,
        windowWidth,
        isSidebarMenuOpen,
        setIsSidebarMenuOpen,
        isSidebarSearchFocused,
        sidebarSearchText,
        setSidebarSearchText,
        isContactsMode,
        setIsContactsMode,
        closeSidebarSearch,
        setIsSidebarSearchFocused,
        isChatSearchFocused,
        setIsChatSearchFocused,
        ...chatSearch,

        isAddContactOpen,
        setIsAddContactOpen,
        closeAddContact,
        handleAddContact,

        contextMenu,
        setContextMenu,
        showMenu,
        closeMenu,

        highlightMsgId,
        setHighlightMsgId,
        triggerHighlight,

        setSidebarWidth,
        setSelectedChatId: handleSelectChat,
        handleSendMessage,
        handleDeleteMessage,
        handlePinMessage,
        handleUnpinMessage,

        replyToMessage,
        setReplyToMessage,
        replyPreview,
        openReply,
        closeReply,

        isEmojiPickerOpen,
        setIsEmojiPickerOpen,
        handleSetReaction,

        isConfirmModalOpen,
        setIsConfirmModalOpen,
        closeConfirmModal,

        toast,
        showToast,
    };
};
