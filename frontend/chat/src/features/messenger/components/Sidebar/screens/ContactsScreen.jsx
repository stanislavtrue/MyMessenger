import { useMessengerContext } from "@/features/messenger/context/MessengerContext";
import { ContactItem } from "../../ContactItem";
import { useState } from "react";
import { Plus } from "lucide-react";
import { AddContactModal } from "../../AddContactModal";

export const ContactsScreen = ({ contacts, filteredContacts, selectedChatId, handleSelectChat }) => {
    const { sidebarSearchText, handleAddContact } = useMessengerContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const displayList = !sidebarSearchText ? contacts : filteredContacts;

    return (
        <div className="relative flex flex-col h-full flex-1 overflow-hidden">
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

            <div className="absolute bottom-5 right-5">
                <div
                    onClick={() => setIsModalOpen(true)} 
                    className="
                        flex items-center justify-center bg-[#734FBA] rounded-full size-14 
                        cursor-pointer hover:bg-[#6740b6] shrink-0
                    "
                >
                    <Plus size={26}/>
                </div>
            </div>

            <AddContactModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddContact}
            />

        </div>
    );
};
