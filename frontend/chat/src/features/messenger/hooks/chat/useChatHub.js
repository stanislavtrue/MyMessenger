import { useCallback, useEffect } from "react";
import connection from "../../services/chatHub";
import { toggleOwnReaction } from "../../utils/toggleOwnReaction";
import { MESSAGE_STATUS } from "../../constants/messageBubbleStatus";
import { formatTime } from "@/utils/formatTime";
import { formatDate } from "@/utils/formatDate";

export const useChatHub = ({ currentUser, setChats, selectedChatId, closeReply }) => {
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

        const handleReactionUpdated = ({ chatId, messageId, reactions }) => {
            setChats(prevChats => prevChats.map((chat) => {
                if (chat.id !== chatId)
                    return chat;

                return {
                    ...chat,
                    messages: chat.messages.map((msg) => {
                        if (msg.id !== messageId)
                            return msg;

                        return {
                            ...msg,
                            reactions: reactions
                        };
                    })
                };
            }));
        };

        connection.on("ReceiveMessage", handleReceiveMessage);
        connection.on("ChatUpdated", handleChatUpdated);
        connection.on("MessagesRead", handleMessagesRead);
        connection.on("UserStatusChanged", handleUserStatusChanged);
        connection.on("UserStartTyping", handleUserStartTyping);
        connection.on("UserStopTyping", handleUserStopTyping);
        connection.on("ReactionUpdated", handleReactionUpdated);

        return () => {
            connection.off("ReceiveMessage", handleReceiveMessage);
            connection.off("ChatUpdated", handleChatUpdated);
            connection.off("MessagesRead", handleMessagesRead);
            connection.off("UserStatusChanged", handleUserStatusChanged);
            connection.off("UserStartTyping", handleUserStartTyping);
            connection.off("UserStopTyping", handleUserStopTyping);
            connection.off("ReactionUpdated", handleReactionUpdated);
        };
    }, [currentUser?.id, connection]);

    useEffect(() => {
        if (!selectedChatId) return;

        const joinChat = async () => {
            try {
                if (connection.state !== "Connected")
                    return;

                await connection.invoke("JoinChat", selectedChatId);
            } catch (error) {
                console.log("JoinChat error: ", error);
            }
        };

        joinChat();
    }, [selectedChatId]);

    const markAsRead = useCallback(async (chatId, messageId) => {
        try {
            await connection.invoke("MarkMessageAsRead", chatId, messageId);
        } catch (error) {
            console.error("Error marking message as read: ", error);
        }
    }, []);

    const handleSendMessage = useCallback(async (text) => {
        if (!text.trim() || !selectedChatId) return;

        try {
            await connection.invoke("SendMessage", selectedChatId, text.trim());
            closeReply();
        } catch (error) {
            console.log("Failed to send message: ", error);
        }
    }, [selectedChatId, closeReply])

    const handleSetReaction = useCallback(async (messageId, emoji) => {
        if (!selectedChatId || !connection)
            return;

        setChats((prevChats) =>
            prevChats.map((chat) => {
                if (chat.id !== selectedChatId) return chat;

                const updatedMessages = chat.messages.map((msg) => {
                    if (msg.id !== messageId) return msg;

                    return {
                        ...msg,
                        reactions: toggleOwnReaction(msg.reactions, emoji)
                    };
                });

                return { ...chat, messages: updatedMessages };
            })
        );

        try {
            await connection.invoke("SetReaction", selectedChatId, messageId, emoji);
        } catch (error) {
            console.error("Failed to set reaction via SignalR", error);
        }
    }, [selectedChatId, setChats]);

    return {
        markAsRead,
        handleSendMessage,
        handleSetReaction
    };
};
