import { useState } from "react"
import { useChatSearch } from "./chat/useChatSearch";
import { useToast } from "../../../hooks/useToast";
import { useMessengerKeyboard } from "./useMessengerKeyboard";
import { useContextMenu } from "./contextMenu/useContextMenu";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useHighlightMessage } from "./chat/useHighlightMessage";
import { useReply } from "./chat/useReply";
import { useChatHub } from "./chat/useChatHub";
import { useChatMessages } from "./chat/useChatMessages";
import { useAuthUser } from "./useAuthUser";
import { useChats } from "./chat/useChats";

export const useMessenger = () => {
    // --- Chat state --------------------------------------------------------------------------
    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);

    // --- Sidebar state -----------------------------------------------------------------------
    const [sidebarWidth, setSidebarWidth] = useState(33);
    const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);

    // --- Sidebar search ----------------------------------------------------------------------
    const [isSidebarSearchFocused, setIsSidebarSearchFocused] = useState(false);
    const [sidebarSearchText, setSidebarSearchText] = useState("");
    const [isContactsMode, setIsContactsMode] = useState(false);

    // --- Chat Search -------------------------------------------------------------------------
    const [isChatSearchFocused, setIsChatSearchFocused] = useState(false);

    // --- UI state ----------------------------------------------------------------------------
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isAddContactOpen, setIsAddContactOpen] = useState(false);

    // --- Derived state -----------------------------------------------------------------------
    const windowWidth = useWindowWidth();
    const selectedChat = chats.find(chat => chat.id === selectedChatId);

    // --- Current User ------------------------------------------------------------------------
    const { currentUser, isLoadingUser } = useAuthUser();

    const { isLoadingChats, handleAddContact: addContact } = useChats({ setChats })

    // --- UI hooks ----------------------------------------------------------------------------
    const { toast, showToast } = useToast();

    const { replyToMessage, replyPreview, openReply, closeReply, setReplyToMessage } = useReply()

    const { highlightMsgId, setHighlightMsgId, triggerHighlight } = useHighlightMessage();

    const { contextMenu, setContextMenu, showMenu, closeMenu } = useContextMenu();

    const chatSearch = useChatSearch(selectedChat, isChatSearchFocused, setIsChatSearchFocused);

    // --- UI handlers --------------------------------------------------------------------------
    const closeSidebarSearch = () => {
        setIsSidebarSearchFocused(false);
        setIsContactsMode(false);
        setSidebarSearchText("");
    };

    const closeConfirmModal = () => setIsConfirmModalOpen(false);
    
    const closeAddContact = () => setIsAddContactOpen(false);

    const { markAsRead, handleSendMessage, handleSetReaction } = useChatHub({
        currentUser,
        setChats,
        selectedChatId,
        closeReply
    });

    const { isLoadingMessages, fetchMessages, handlePinMessage, handleUnpinMessage, handleDeleteMessage } = useChatMessages({
        setChats,
        currentUserId: currentUser?.id,
        closeReply,
        replyToMessage
    })

    const handleAddContact = ({ firstName, lastName, username }) => {
        addContact(firstName, lastName, username);
        closeAddContact();
    };

    const handleSelectChat = async (chatId) => {
        closeMenu();
        setSelectedChatId(chatId);

        setIsChatSearchFocused(false);
        if (chatSearch?.setChatSearchText) {
            chatSearch.setChatSearchText("");
        }

        await fetchMessages(chatId);
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
        // CurrentUser
        currentUser,
        isLoadingUser,
        
        // Chats
        chats,
        selectedChat,
        selectedChatId,
        isLoadingChats,
        setSelectedChatId: handleSelectChat,

        // Chat messages
        isLoadingMessages,
        markAsRead,
        handleSendMessage,
        handleDeleteMessage,
        handlePinMessage,
        handleUnpinMessage,

        // Reactions
        handleSetReaction,

        // Chat search
        isChatSearchFocused,
        setIsChatSearchFocused,
        ...chatSearch,

        // Reply
        replyToMessage,
        setReplyToMessage,
        replyPreview,
        openReply,
        closeReply,

        // Highlight
        highlightMsgId,
        setHighlightMsgId,
        triggerHighlight,

        // Sidebar
        sidebarWidth,
        setSidebarWidth,
        isSidebarMenuOpen,
        setIsSidebarMenuOpen,

        // Sidebar search
        isSidebarSearchFocused,
        setIsSidebarSearchFocused,
        sidebarSearchText,
        setSidebarSearchText,
        isContactsMode,
        setIsContactsMode,
        closeSidebarSearch,

        // Emoji picker
        isEmojiPickerOpen,
        setIsEmojiPickerOpen,

        // Context menu
        contextMenu,
        setContextMenu,
        showMenu,
        closeMenu,

        // Modals
        isConfirmModalOpen,
        setIsConfirmModalOpen,
        closeConfirmModal,

        isAddContactOpen,
        setIsAddContactOpen,
        closeAddContact,

        // Contacts
        handleAddContact,

        // Layout
        windowWidth,

        // Toast
        toast,
        showToast,
    };
};
