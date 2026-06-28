import { useRipple } from "@/hooks/useRipple";
import { formatSidebarDate } from "../utils/formatSidebarDate";
import { TypingIndicator } from "./indicators/TypingIndicator";
import { Avatar } from "./Avatar";

export const ChatItem = ({ chat, lastMessageText, lastMessageTime, lastMessageDate, selectedChatId, setSelectedChatId, isContextActive, onContextMenu }) => {
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
            onContextMenu={onContextMenu}
            className={`
                relative flex items-center gap-2 px-2! py-2!
                w-[97%] rounded-2xl m-auto!
                select-none overflow-hidden
                transition-colors duration-0 
                cursor-pointer
                
                ${isSelected
                    ? "bg-[#6F4F9C] hover:bg-[#6F4F9C]"
                    : "hover:bg-[#282836]"
                }

                ${isContextActive && !isSelected
                    ? "bg-[#282836]"
                    : ""
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

            <div className="relative w-14 h-14 rounded-full bg-linear-to-b from-[#D95353] to-[#732C2C] flex items-center justify-center text-white text-2xl! z-10 shrink-0">
                {(chat.user.status === "online" || chat.user.status === "typing") && (
                    <div className={`
                        absolute w-3.5 h-3.5 rounded-full bottom-0 right-1 border-2! 

                        ${isSelected 
                            ? "bg-white border-[#6F4F9C]!"
                            : "bg-[#0AC630] border-[#1F1F28]!"
                        }
                    `}  />
                )}
                <Avatar 
                    avatar={chat.user.avatar}
                    name={chat.user.displayName}
                />
            </div>

            <div className="flex flex-col min-w-0 flex-1 z-10">
                <span className="text-white font-medium text-lg! truncate">
                    {chat.user.displayName}
                </span>
                {chat.user.status === "typing" ? (
                    <TypingIndicator
                        activeColor={isSelected ? "#FFFFFF" : "#52526B"}
                        textClassName={`
                            text-sm!
                            ${isSelected ? "text-[#FFFFFF]" : "text-[#52526B]"}    
                        `}
                    />
                ) : (
                    <span className={`
                            text-[#52526B] text-sm! truncate

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
                    text-xs! transition-colors duration-200

                    ${isSelected
                        ? "text-[#FFFFFF]"
                        : "text-[#7D7DA2]"
                    }
                    
                `}>
                    {formatSidebarDate(lastMessageDate, lastMessageTime)}
                </span>

                {unreadCount > 0 ? (
                    <div className={`
                            flex items-center justify-center
                            min-w-6 h-6 px-1.5! text-[#FFFFFF]/80
                            rounded-full text-sm! font-semibold!
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
