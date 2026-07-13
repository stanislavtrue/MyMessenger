import { useState } from "react"
import { mockChats } from "../mocks/mockChats";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";

import { useChatSearch } from "./useChatSearch";
import { useToast } from "../../../hooks/useToast";
import { useMessengerKeyboard } from "./useMessengerKeyboard";
import { useContextMenu } from "./useContextMenu";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useHighlightMessage } from "./useHighlightMessage";
import { useReply } from "./useReply";
import { useMockIncomingMessages } from "./useMockIncomingMessages";

export const useMessenger = () => {
    const [chats, setChats] = useState(mockChats);
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
    const [currentUser] = useState({
        id: "main_user_id",
        displayName: "Empty",
        username: "empty_dev",
        avatar: "/MainUserAvatar.jpg"
    });

    const windowWidth = useWindowWidth();
    const { toast, showToast } = useToast();
    const { replyToMessage, replyPreview, openReply, closeReply, setReplyToMessage } = useReply()
    const { highlightMsgId, setHighlightMsgId, triggerHighlight } = useHighlightMessage();
    const { contextMenu, setContextMenu, showMenu, closeMenu } = useContextMenu();

    const selectedChat = chats.find(chat => chat.id === selectedChatId);
    const chatSearch = useChatSearch(selectedChat, isChatSearchFocused, setIsChatSearchFocused);

    useMockIncomingMessages(setChats, selectedChatId);

    const closeSidebarSearch = () => {
        setIsSidebarSearchFocused(false);
        setIsContactsMode(false);
        setSidebarSearchText("");
    };

    const closeConfirmModal = () => setIsConfirmModalOpen(false);

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
        setIsAddContactOpen(false);
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

    const handleSelectChat = (chatId) => {
        closeMenu();
        setSelectedChatId(chatId);

        setIsChatSearchFocused(false);
        if (chatSearch?.setChatSearchText) {
            chatSearch.setChatSearchText("");
        }

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

    const handleSendMessage = (text) => {
        if (!text.trim() || !selectedChatId) return;

        const messageId = Date.now();

        let senderName = "";
        if (replyToMessage) {
            senderName = replyToMessage.isOwnMessage ? currentUser.displayName : selectedChat.user.displayName;
        }

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
                senderName: senderName
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
        isChatSearchFocused,
        closeChatSearch: chatSearch.closeChatSearch,
        replyToMessage,
        closeReply,
        selectedChatId,
        setSelectedChatId: handleSelectChat
    });

    return {
        currentUser,
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
