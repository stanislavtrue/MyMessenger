import { formatSidebarDate } from "@/features/messenger/utils/formatSidebarDate";

export const ChatMeta = ({ lastMessageAt, unreadCount, isSelected }) => {
    return (
        <div className="flex flex-col items-end justify-between h-12 z-12 shrink-0 ml-auto">
            <span className={`
                text-xs! transition-colors duration-200
                ${isSelected  ? "text-[#FFFFFF]" : "text-[#7D7DA2]"}
            `}>
                {formatSidebarDate(lastMessageAt)}
            </span>

            {unreadCount > 0 ? (
                <div className={`
                    flex items-center justify-center
                    min-w-6 h-6 px-1.5! text-[#FFFFFF]/80
                    rounded-full text-sm! font-semibold!
                    transition-all duration-200
                    ${isSelected ? "bg-[#7D7DA2]/50" : "bg-[#7D7DA2]/70"}
                `}>
                    {unreadCount}
                </div>
            ) : (
                <div className="h-5 w-5" />
            )}
        </div>
    );
};
