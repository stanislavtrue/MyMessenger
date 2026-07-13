import { SidebarRecentChats } from "../sections/SidebarRecentChats";
import { SidebarTabs } from "../sections/SidebarTabs";

export const DiscoverScreen = ({ activeChats, selectedChatId, handleSelectChat }) => {
    return (
        <div className="relative flex flex-col flex-1 min-h-0">
            <SidebarTabs />

            <div className="absolute h-4 w-full bg-linear-to-b from-[#1F1F28] to-[#1F1F28]/10 z-10"/>

            <SidebarRecentChats
                activeChats={activeChats}
                selectedChatId={selectedChatId}
                handleSelectChat={handleSelectChat}
            />
        </div>
    );
};
