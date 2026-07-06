import { useMessengerContext } from "@/features/messenger/context/MessengerContext"
import { HomeScreen } from "./HomeScreen";
import { DiscoverScreen } from "./DiscoverScreen";
import { ContactsScreen } from "./ContactsScreen";
import { SearchScreen } from "./SearchScreen";

export const SidebarScreen = ({ activeChats, selectedChatId, handleSelectChat, contacts, filteredChats, filteredContacts, filteredMessages }) => {
    const { isContactsMode, sidebarSearchText, isSidebarSearchFocused } = useMessengerContext();

    const mode = 
        isContactsMode
            ? "contacts"
            : sidebarSearchText
                ? "search"
                : isSidebarSearchFocused
                    ? "discover"
                    : "home";

    switch (mode) {
        case "home":
            return <HomeScreen activeChats={activeChats} selectedChatId={selectedChatId} handleSelectChat={handleSelectChat} />;

        case "discover":
            return <DiscoverScreen activeChats={activeChats} selectedChatId={selectedChatId} handleSelectChat={handleSelectChat} />;

        case "contacts":
            return <ContactsScreen contacts={contacts} filteredContacts={filteredContacts} selectedChatId={selectedChatId} handleSelectChat={handleSelectChat} />;

        case "search": 
            return (
                <SearchScreen  
                    filteredChats={filteredChats} filteredContacts={filteredContacts} filteredMessages={filteredMessages}
                    selectedChatId={selectedChatId} handleSelectChat={handleSelectChat}
                />
            );

        default:
            return null;
    }
};
