import { useMessengerContext } from "@/features/messenger/context/MessengerContext";
import { ContactItem } from "../../ContactItem";

export const ContactsScreen = ({ contacts, filteredContacts, selectedChatId, handleSelectChat }) => {
    const { sidebarSearchText } = useMessengerContext();
    const displayList = !sidebarSearchText ? contacts : filteredContacts;

    return (
        <div className="flex-1 overflow-y-auto">
            {displayList.map(item => (
                <ContactItem
                    key={item.id}
                    contact={item}
                    isSelected={item.id === selectedChatId}
                    onSelect={handleSelectChat}
                />
            ))}
        </div>
    );
};
