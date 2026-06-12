import { useEffect, useRef, useState } from "react"
import { mockChats } from "../data/mockChats"
import { formatTime } from "../utils/formatTime";
import { formatDate } from "../utils/formatDate";

export const useMessenger = () => {
    const [chats, setChats] = useState(mockChats);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [sidebarWidth, setSidebarWidth] = useState(33);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [replyToMessage, setReplyToMessage] = useState(null);
    const [replyPreview, setReplyPreview] = useState(null);
    const [toast, setToast] = useState(null);

    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        isUp: false,
        isLeft: false,
        type: null,
        messageData: null,
        isMeasuring: true,
    });
    
    const selectedChat = chats.find(chat => chat.id === selectedChatId);

    const replyTimeoutRef = useRef(null);
    const toastTimeoutRef = useRef(null);

    const showToast = (text) => {
        clearTimeout(toastTimeoutRef.current);

        setToast({
            id: Date.now(),
            text
        });

        toastTimeoutRef.current = setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const openReply = (message) => {
        clearTimeout(replyTimeoutRef.current)
        setReplyPreview(message);

        // mount 'preview' before launching animation
        setTimeout(() => {
            setReplyToMessage(message);
        }, 0);
    };

    const closeReply = () => {
        setReplyToMessage(null);

        replyTimeoutRef.current = setTimeout(() => {
            setReplyPreview(null);
        }, 200);
    };

    useEffect(() => {
        return () => {
            clearTimeout(toastTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        return () => {
            clearTimeout(replyTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key !== "Escape") return;

            if (contextMenu.visible) {
                setContextMenu(prev => ({
                    ...prev,
                    visible: false,
                }));
                return;
            }

            if (isSidebarMenuOpen) {
                setIsSidebarMenuOpen(false);
                return;
            }

            if (isSearchFocused) {
                setIsSearchFocused(false);
                return;
            }

            if (replyToMessage) {
                closeReply();
                return;
            }

            if (selectedChatId) {
                setSelectedChatId(null);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        }
    }, [contextMenu.visible, isSidebarMenuOpen, isSearchFocused, selectedChatId, replyToMessage])

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {

            setChats(prevChats => {
                const inactiveChats = chats.filter(c => c.id !== selectedChatId);
                if (inactiveChats.length === 0) return prevChats;

                const randomChat = inactiveChats[Math.floor(Math.random() * inactiveChats.length)];
                const spamMessage = {
                    id: Date.now(),
                    text: "It`s spam!!! I'll ddos you!!!",
                    time: formatTime(),
                    date: formatDate(),
                    isOwnMessage: false,
                    status: "sent"
                };
                
                return prevChats.map(chat => {
                    if (chat.id === randomChat.id) {
                        return {
                            ...chat,
                            lastMessage: spamMessage.text,
                            time: formatTime(),
                            unreadCount: (chat.unreadCount || 0) + 1,
                            messages: [...chat.messages, spamMessage]
                        };
                    }
                    return chat;
                });
            });
        }, 30000);

        return () => clearInterval(interval);
    }, [selectedChatId, chats]);

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);

        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === chatId) {
                return {
                    ...chat,
                    unreadCount: 0,
                    messages: chat.messages.map(msg => ({
                        ...msg,
                        status: "read"
                    }))
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

                    return {
                        ...chat,
                        lastMessage: nextLastMessage ? nextLastMessage.text : "No messages yet",
                        time: nextLastMessage ? nextLastMessage.time : "",
                        messages: updatedMessages
                    };
                }

                return chat;
            })
        );
    };

    const handleSendMessage = (text) => {
        if (!text.trim() || !selectedChatId) return;

        const messageId = Date.now();

        const newMessage = {
            id: messageId,
            text,
            time: formatTime(),
            date: formatDate(),
            isOwnMessage: true,
            status: "sent",
            replyTo: replyToMessage ? {
                id: replyToMessage.id,
                text: replyToMessage.text,
                isOwnMessage: replyToMessage.isOwnMessage,
            } : null
        };
        
        setChats(prevChats => prevChats.map(chat => {
                if (chat.id === selectedChatId) {
                    return {
                        ...chat,
                        lastMessage: text,
                        time: formatTime(),
                        messages: [...chat.messages, newMessage]
                    };
                }

                return chat;
            })
        );

        setTimeout(() => {
            const friendMessage = {
                id: Date.now() + 1,
                text: "Hello!",
                time: formatTime(),
                date: formatDate(),
                isOwnMessage: false,
                status: "sent"
            };

            setChats(prevChats => prevChats.map(chat => {
                if (chat.id === selectedChatId) {
                    return {
                        ...chat,
                        lastMessage: friendMessage.text,
                        time: formatTime(),
                        unreadCount: 0,
                        messages: [...chat.messages, friendMessage]
                    };
                }
                
                return chat;
            }));
        }, 3000);

        closeReply();
    };

    return {
        chats,
        selectedChat,
        selectedChatId,
        sidebarWidth,
        windowWidth,

        isSidebarMenuOpen,
        setIsSidebarMenuOpen,
        isSearchFocused,
        setIsSearchFocused,

        contextMenu,
        setContextMenu,

        setSidebarWidth,
        setSelectedChatId: handleSelectChat,
        handleSendMessage,
        handleDeleteMessage,
        replyToMessage,
        setReplyToMessage,
        replyPreview,
        openReply,
        closeReply,

        toast,
        showToast,
    };
};
