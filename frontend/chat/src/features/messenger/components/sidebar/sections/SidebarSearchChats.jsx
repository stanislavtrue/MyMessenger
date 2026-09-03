import { useHorizontalWheel } from "@/features/messenger/hooks/sidebar/useHorizontalWheel";
import { SearchChatItem } from "../chatItem/SearchChatItem";

export const SidebarSearchChats = ({ filteredChats, handleSelectChat }) => {
    const scrollRef = useHorizontalWheel(0.2);

    return (
        <div className="absolute top-3 left-4 right-4 z-20">
            <div 
                ref={scrollRef}
                className="
                    flex gap-2 py-2! px-2! overflow-x-auto 
                    scrollbar-none bg-[#202020] rounded-full shrink-0
                    border-t! border-b! border-[#2C2C2C]
                "
            >
                {filteredChats.slice(0, 10).map((chat, idx) => (
                    <SearchChatItem
                        key={`search-mini-${chat.id}-${idx}`}
                        chat={chat}
                        onSelect={handleSelectChat}
                    />
                ))}
            </div>
        </div>
    );
};
