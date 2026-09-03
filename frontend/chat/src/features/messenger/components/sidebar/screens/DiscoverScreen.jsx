import { SidebarRecentChats } from "../sections/SidebarRecentChats";
import { SidebarTabs } from "../sections/SidebarTabs";

export const DiscoverScreen = ({ activeChats, selectedChatId, handleSelectChat }) => {
    return (
        <div className="relative flex flex-col flex-1 min-h-0">
            <SidebarTabs />

            <div className="absolute h-px w-full bg-[#2C2C2C] z-10"/>

            <SidebarRecentChats
                activeChats={activeChats}
                selectedChatId={selectedChatId}
                handleSelectChat={handleSelectChat}
            />
        </div>
    );
};
