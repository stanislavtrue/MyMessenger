import { useHorizontalWheel } from "@/features/messenger/hooks/useHorizontalWheel";
import { RecentChatAvatar } from "../../RecentChatAvatar";

export const SidebarRecentChats = ({ activeChats, selectedChatId, handleSelectChat }) => {
    const scrollRef = useHorizontalWheel(0.2);

    return (
        <div className="flex-1 overflow-y-auto px-4! pt-20! pb-4!">
            <div 
                ref={scrollRef} 
                className="flex items-center p-2! bg-[#111111] rounded-3xl overflow-x-auto scrollbar-none"
            >
                {activeChats.slice(0, 10).map(chat => (
                    <RecentChatAvatar
                        key={chat.id}
                        chat={chat}
                        isSelected={chat.id === selectedChatId}
                        onSelect={handleSelectChat}
                    />
                ))}
            </div>
        </div>
    );
};
