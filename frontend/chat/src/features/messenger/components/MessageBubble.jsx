import { Check } from "lucide-react";
import { useMessengerContext } from "../context/MessengerContext";
import { highlightText } from "../utils/highlightText";

export const MessageBubble = ({ message, isFirstMessage, isLastMessage }) => {
    const { searchText, handleSetReaction } = useMessengerContext();

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
                    ? "ml-auto! mr-4! bg-[#252530]"
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

                <div className="flex flex-col">
                    <span className="flex-1 text-white text-sm! whitespace-pre-wrap! overflow-hidden">
                        {highlightText(message.text, searchText)}
                    </span>
                    <div className={`
                        absolute -bottom-2 z-30
                        w-8 h-4 group cursor-pointer
                        ${message.isOwnMessage ? "-left-1" : "-right-1"}    
                    `}>
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSetReaction(message.id, "❤️");
                            }}
                            className={`
                                absolute -bottom-1 z-30
                                flex items-center justify-center
                                size-6 cursor-pointer
                                opacity-0 scale-75 pointer-events-none
                                group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
                                transition-all duration-200 ease-out
                                hover:scale-140! active:scale-90!
                                
                                ${message.isOwnMessage ? "-left-1" : "-right-1"}
                            `}
                        >
                            {"❤️"}
                        </div>
                    </div>

                    {message.reaction && (
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSetReaction?.(message.id, message.reaction);
                            }}
                            className={`
                                z-10 w-fit gap-2 my-1!
                                flex justify-center items-center
                                px-1.5! py-0.5! rounded-full
                                text-md! select-none animate-scale-up 
                                cursor-pointer
                                ${message.isOwnMessage ? "bg-[#CFA4F2]/80 hover:bg-[#CFA4F2]" : "bg-white/80 hover:bg-white"}
                            `}
                        >
                            <span>{message.reaction}</span>
                            <div className="size-5 rounded-full bg-white"/>
                        </div>
                    )}
                </div>

                <span style={{fontFamily: "Roboto"}} className="text-xs! opacity-50 leading-none ml-auto! shrink-0 select-none">
                    {message.time?.slice(0, 5)}
                </span>

                {message.isOwnMessage && (
                    <div className="flex items-center relative w-2 h-3 shrink-0">
                        <Check
                            size={14}
                            className={`
                                absolute -left-1.5 -bottom-0.5 transition-colors duration-200
                                ${message.status === "read" ? "text-[#E2D9F3]" : "text-[#FFFFFF]/60"}
                            `}
                        />

                        {message.status === "read" && (
                            <Check 
                                size={14}                           
                                className="absolute text-[#E2D9F3] left-0 -bottom-0.5"
                            />
                        )}

                    </div>
                )}

            </div>

            {isLastMessage && (
                <>
                    <div className={`
                            absolute
                            bottom-0
                            w-2 h-2
                            opacity-85

                            ${message.isOwnMessage
                                ? "-right-2 rounded-full bg-[#252530]" 
                                : "-left-2 rounded-full bg-[#5A4282]"
                            }
                        `}
                    />
                
                    <div className={`
                            absolute
                            bottom-0
                            w-1 h-1
                            opacity-70

                            ${message.isOwnMessage
                                ? "-right-3.5 rounded-full bg-[#252530]"
                                : "-left-3.5 rounded-full bg-[#5A4282]"
                            }
                        `} 
                    />
                </>
            )}

        </div>
    );
}
