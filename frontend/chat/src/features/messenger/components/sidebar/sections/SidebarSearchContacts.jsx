import { ContactsChatItem } from "../chatItem/ContactsChatItem";

export const SidebarSearchContacts = ({ filteredContacts, selectedChatId, handleSelectChat }) => {
    return (
        filteredContacts.length > 0 && (
            <div className="flex flex-col py-2! mb-4! bg-[#111111] rounded-3xl scrollbar-thin scrollbar-[#282836]">
                <span className="text-md! pl-6! pt-2! pb-2! font-semibold! text-[#B06EE4]">Chats</span>
                {filteredContacts.map((item, idx) => (
                    <ContactsChatItem
                        key={`search-chat-${item.id}-${idx}`}
                        contact={item}
                        isSelected={item.id === selectedChatId}
                        onSelect={handleSelectChat}
                    />
                ))}
            </div>
        )
    );
};
