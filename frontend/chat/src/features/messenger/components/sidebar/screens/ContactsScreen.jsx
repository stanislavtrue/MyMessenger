import { useMessengerContext } from "@/features/messenger/context/MessengerContext";
import { Plus } from "lucide-react";
import { AddContactModal } from "../../modals/AddContactModal";
import { ContactsChatItem } from "../chatItem/ContactsChatItem";

export const ContactsScreen = ({ contacts, filteredContacts, selectedChatId, handleSelectChat }) => {
    const { sidebarSearchText, handleAddContact, isAddContactOpen, setIsAddContactOpen, closeAddContact } = useMessengerContext();

    const displayList = !sidebarSearchText ? contacts : filteredContacts;

    return (
        <div className="relative flex flex-col h-full flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                {displayList.map(item => (
                    <ContactsChatItem
                        key={item.id}
                        contact={item}
                        isSelected={item.id === selectedChatId}
                        onSelect={handleSelectChat}
                    />
                ))}
            </div>

            <div className="absolute bottom-5 right-5">
                <div
                    onClick={() => setIsAddContactOpen(true)} 
                    className="
                        flex items-center justify-center bg-[#527AFF] rounded-full size-14 
                        cursor-pointer hover:bg-[#6740b6] shrink-0
                    "
                >
                    <Plus size={26}/>
                </div>
            </div>

            <AddContactModal 
                isOpen={isAddContactOpen}
                onClose={closeAddContact}
                onAdd={handleAddContact}
            />

        </div>
    );
};
