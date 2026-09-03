import { useMessengerContext } from "@/features/messenger/context/MessengerContext";
import { highlightText } from "@/features/messenger/utils/highlightText";
import { formatSidebarDate } from "@/features/messenger/utils/formatSidebarDate";
import { Avatar } from "../../common/Avatar";

export const SidebarSearchMessages = ({ filteredMessages, handleSelectChat }) => {
    const { sidebarSearchText } = useMessengerContext();

    return (
        filteredMessages.length > 0 && (
            <div className="flex flex-col py-2! bg-[#202020] rounded-3xl"> 
                <span className="text-md! pl-6! pt-2! pb-2! font-semibold! text-[#527AFF]">Messages</span>
                {filteredMessages.map((msg, idx) => (
                    <div
                        key={`search-msg-${msg.id}-${idx}`}
                        onClick={() => handleSelectChat(msg.chatId)}
                        className="
                            flex items-center gap-3 px-3! py-1.5! mx-2!
                            rounded-2xl hover:bg-[#282828]
                            cursor-pointer transition-colors duration-0
                        "
                    >
                        <div className="text-white text-xl! shrink-0">
                            <Avatar
                                size="size-[54px]"
                                avatar={msg.chatUser.avatar}
                                name={msg.chatUser.displayName}
                            />
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-md! font-medium! truncate">
                                {msg.chatUser.displayName}
                            </span>

                            <span className="text-[#959595] text-sm! truncate mt-0.5!">
                                {highlightText(msg.text, sidebarSearchText)}
                            </span>
                        </div>
                    
                        <span className="text-xs! text-[#959595] shrink-0 -mt-5!">
                            {formatSidebarDate(msg.date, msg.time)}
                        </span>
                    </div>
                ))}
            </div>  
        )
    );
}
