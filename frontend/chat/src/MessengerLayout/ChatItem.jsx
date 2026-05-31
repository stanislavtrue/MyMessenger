import { formatSidebarDate } from "../utils/formatSidebarDate"
import { useRipple } from "../hooks/useRipple";
import { TypingIndicator } from "../components/indicators/TypingIndicator";

export const ChatItem = ( {chat, lastMessageText, lastMessageTime, lastMessageDate, selectedChatId, setSelectedChatId} ) => {
    const isSelected = selectedChatId === chat.id;
    const { ripples, createRipple } = useRipple();

    const handleClick = (e) => {
        createRipple(e);

        setTimeout(() => {
            setSelectedChatId(chat.id);
        }, 80);
    };

    const unreadCount = chat.unreadCount || 0;

    return (
        <div 
            onClick={handleClick}
            className={`
                relative
                overflow-hidden
                transition-colors 
                flex 
                items-center 
                gap-2
                px-2!
                py-2!
                cursor-pointer
                w-[97%] rounded-2xl
                m-auto!
                select-none
                
                ${isSelected
                    ? "bg-[#6F4F9C] hover:bg-[#6F4F9C]"
                    : "hover:bg-[#282836]"
                }
            `}
        >

            {ripples.map((ripple) => (
                <span 
                    key={ripple.id}
                    className="animate-ripple"
                    style={{
                        top: ripple.y,
                        left: ripple.x,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                />
            ))}

            <div className="relative w-14 h-14 rounded-full bg-[#5A4282] flex items-center justify-center text-white text-2xl! z-10 shrink-0">
                {(chat.status === "online" || chat.status === "typing") && (
                    <div className={`
                        absolute
                        w-3.5 h-3.5
                        rounded-full
                        bottom-0 right-1
                        bg-[#0AC630]
                        border!
                    `}  />
                )}

                {chat.name[0]}
            </div>

            <div className="flex flex-col min-w-0 flex-1 z-10">
                <span className="text-white font-medium text-lg! truncate">
                    {chat.name}
                </span>
                {chat.status === "typing" ? (
                    <TypingIndicator 
                        activeColor={isSelected ? "#FFFFFF" : "#52526B"}
                        textClassName={`
                            text-sm!
                            ${isSelected ? "text-[#FFFFFF]" : "text-[#52526B]"}    
                        `}
                    />
                ) : (
                    <span className={`
                            text-[#52526B] 
                            text-sm!
                            truncate

                            ${isSelected
                                ? "text-[#FFFFFF]"
                                : "text-[#52526B]"
                            }
                        `}
                    >
                
                        {lastMessageText}
                    </span>
                )}
            </div>

            <div 
                style={{
                    fontFamily: "Roboto"
                }}
                className="flex flex-col items-end justify-between h-12 z-12 shrink-0 ml-auto"
            >
                <span className={`
                    text-xs! 
                    transition-colors 
                    duration-200

                    ${isSelected
                        ? "text-[#FFFFFF]"
                        : "text-[#7D7DA2]"
                    }
                    
                `}>
                    {formatSidebarDate(lastMessageDate, lastMessageTime)}
                </span>

                {unreadCount > 0 ? (
                    <div className={`
                            min-w-6 h-6
                            text-[#FFFFFF]/80
                            rounded-full
                            px-1.5!
                            flex items-center justify-center
                            text-sm! font-semibold!
                            transition-all duration-200

                            ${isSelected
                                ? "bg-[#7D7DA2]/50"
                                : "bg-[#7D7DA2]/70"
                            }
                        `}>
                        {unreadCount}
                    </div>
                ) : (
                    <div className="h-5 w-5" />
                )}

            </div>

        </div>
    );
}
