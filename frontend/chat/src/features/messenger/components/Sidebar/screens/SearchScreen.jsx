import { SidebarSearchChats } from "../sections/SidebarSearchChats";
import { SidebarSearchContacts } from "../sections/SidebarSearchContacts";
import { SidebarSearchMessages } from "../sections/SidebarSearchMessages";

export const SearchScreen = ({
    filteredChats, filteredContacts, filteredMessages,
    selectedChatId, handleSelectChat,
}) => {
    return (
        <div className="relative flex flex-col flex-1 min-h-0">
            <SidebarSearchChats 
                filteredChats={filteredChats}
                handleSelectChat={handleSelectChat}
            />

            <div className="absolute h-4 w-full bg-linear-to-b from-[#1F1F28] to-[#1F1F28]/10 z-10"/>

            <div className="flex-1 overflow-y-auto px-4! pt-18! pb-4!">
                <SidebarSearchContacts 
                    filteredContacts={filteredContacts}
                    selectedChatId={selectedChatId}
                    handleSelectChat={handleSelectChat}
                />

                <SidebarSearchMessages
                    filteredMessages={filteredMessages}
                    handleSelectChat={handleSelectChat}
                />
            </div>
        </div>
    );
};
