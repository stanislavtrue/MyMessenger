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

    const windowWidth = useWindowWidth();
    const { toast, showToast } = useToast();
    const { replyToMessage, replyPreview, openReply, closeReply, setReplyToMessage } = useReply()
    const { highlightMsgId, setHighlightMsgId, triggerHighlight } = useHighlightMessage();
    const { contextMenu, setContextMenu, showMenu, closeMenu } = useContextMenu();
    
    const selectedChat = chats.find(chat => chat.id === selectedChatId);
    const chatSearch = useChatSearch(selectedChat, isChatSearchFocused, setIsChatSearchFocused);

    useMockIncomingMessages(setChats, selectedChatId);

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);

        setIsChatSearchFocused(false);
        if (chatSearch?.setSearchText) {
            chatSearch.setSearchText("");
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

                return {
                    ...chat,
                    pinnedMessages: [...pinnedMessages, message] 
                };
            }

            return chat;
        }));
    };

    const handleUnpinMessage = (chatId, messageId) => {
        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === chatId) {
                const pinnedMessages = chat.pinnedMessages || [];
                return {
                    ...chat,
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

    useMessengerKeyboard({
        contextMenuVisible: contextMenu.visible,
        closeMenu,
        isSidebarMenuOpen,
        setIsSidebarMenuOpen,
        isEmojiPickerOpen,
        setIsEmojiPickerOpen,
        isSidebarSearchFocused,
        setIsSidebarSearchFocused,
        isChatSearchFocused,
        closeChatSearch: chatSearch.closeChatSearch,
        replyToMessage,
        closeReply,
        selectedChatId,
        setSelectedChatId: handleSelectChat
    });

    return {
        chats,
        selectedChat,
        selectedChatId,
        sidebarWidth,
        windowWidth,
        isSidebarMenuOpen,
        setIsSidebarMenuOpen,
        isSidebarSearchFocused,
        setIsSidebarSearchFocused,
        isChatSearchFocused,
        setIsChatSearchFocused,
        ...chatSearch,

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

        toast,
        showToast,
    };
};
