import { Check } from "lucide-react";
import { useMessengerContext } from "../context/MessengerContext";
import { highlightText } from "../utils/highlightText";

export const MessageBubble = ({ message, isFirstMessage, isLastMessage }) => {
    const { searchText, filteredSearchMessages, currentSearchIndex } = useMessengerContext();

    let radiusClass = "";

    if (!isFirstMessage && !isLastMessage) {
        if (message.isOwnMessage) {
            radiusClass="rounded-br-md rounded-tr-md"
        } else {
            radiusClass="rounded-bl-md rounded-tl-md"
        }
    }
    else if (isFirstMessage && !isLastMessage) {
        if (message.isOwnMessage) {
            radiusClass="rounded-br-md"
        } else {
            radiusClass="rounded-bl-md"
        }
    }
    else if (!isFirstMessage && isLastMessage) {
        if (message.isOwnMessage) {
            radiusClass="rounded-tr-md"
        } else {
            radiusClass="rounded-tl-md"
        }
    }

    return (
        <div className={`
                relative
                w-fit
                max-w-[75%]
                rounded-2xl
                
                py-1! px-3!
                ${radiusClass}

                ${message.isOwnMessage
                    ? "ml-auto! mr-4! bg-[#363646]"
                    : "mr-auto! ml-4! bg-[#5A4282]"
                }
            `}
        >
            {message.replyTo && (
                <div className={`
                        flex flex-col my-1! justify-between h-10 w-full text-sm! rounded-sm cursor-pointer select-none
                        
                        ${message.isOwnMessage
                            ? "bg-white/10 border-white! border-l-4! hover:bg-white/5"
                            : "bg-[#8F5EB5]/20 border-[#8F5EB5]! border-l-4! hover:bg-[#8F5EB5]/15"
                        }
                    `}
                >
                    <span className="px-2!">
                        {message.replyTo.isOwnMessage ? "Main User" : "User"}
                    </span>
                    <span className="px-2! truncate min-w-40">
                        {message.replyTo.text}
                    </span>
                </div>
            )}
            
            <div className="flex items-end justify-between w-full gap-2">

                <span className="flex-1 text-white text-sm! whitespace-pre-wrap! overflow-hidden">
                    {highlightText(message.text, searchText)}
                </span>

                <span style={{fontFamily: "Roboto"}} className="text-xs! opacity-50 leading-none ml-auto! shrink-0 select-none">
                    {message.time?.slice(0, 5)}
                </span>

                {message.isOwnMessage && (
                    <div className="flex items-center relative w-4.5 h-3 ml-0.5! shrink-0">
                        <Check
                            size={14}
                            className={`
                                absolute right-0 -bottom-0.5 transition-colors duration-200
                                ${message.status === "read" ? "text-[#E2D9F3]" : "text-[#FFFFFF]/60"}
                            `}
                        />

                        {message.status === "read" && (
                            <Check 
                                size={14}                           
                                className="absolute text-[#E2D9F3] right-1.5 -bottom-0.5"
                            />
                        )}

                    </div>
                )}

            </div>

            {isLastMessage && (
                <>
                    <div className={`
                            absolute
                            -bottom-0
                            w-2 h-2
                            opacity-85

                            ${message.isOwnMessage
                                ? "right-[-8px] rounded-full bg-[#363646]" 
                                : "left-[-8px] rounded-full bg-[#5A4282]"
                            }
                        `}
                    />
                
                    <div className={`
                            absolute
                            -bottom-0
                            w-1 h-1
                            opacity-70

                            ${message.isOwnMessage
                                ? "right-[-14px] rounded-full bg-[#363646]"
                                : "left-[-14px] rounded-full bg-[#5A4282]"
                            }
                        `} 
                    />
                </>
            )}

        </div>
    );
}
