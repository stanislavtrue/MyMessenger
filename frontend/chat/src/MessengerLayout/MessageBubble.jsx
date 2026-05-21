export const MessageBubble = ({ message, isFirstMessage, isLastMessage }) => {
    return (
        <div className={`
                relative
                w-fit
                max-w-[70%]
                rounded-xl
                
                py-1! px-4! mx-16! mb-1!
                wrap-break-word
                
                ${message.isOwnMessage
                    ? "ml-auto! bg-[#363646]"
                    : "mr-auto! bg-[#957AAA]"
                }

                ${isFirstMessage && isLastMessage 
                    ? "rounded-xl! mb-3!"
                    : ""
                }

                ${!isFirstMessage && !isLastMessage && message.isOwnMessage
                    ? "rounded-tr-xs rounded-br-xs"
                    : "rounded-tl-xs rounded-bl-xs"
                }

                ${isFirstMessage && message.isOwnMessage
                    ? "rounded-br-xs"
                    : "rounded-bl-xs"
                }

                ${isLastMessage && message.isOwnMessage
                    ? "rounded-tr-xs"
                    : "rounded-tl-xs"
                }


            `}
        >
            
            <div className="text-white text-lg!">
                {message.text}
            </div>

            {isLastMessage && (
                <>
                    <div className={`
                            absolute
                            -bottom-1
                            w-2 h-2
                            opacity-85

                            ${message.isOwnMessage
                                ? "right-[-6px] rounded-full bg-[#363646]" 
                                : "left-[-6px] rounded-full bg-[#957AAA]"
                            }
                        `}
                    />
                
                    <div className={`
                            absolute
                            -bottom-1.5
                            w-1 h-1
                            opacity-70

                            ${message.isOwnMessage
                                ? "right-[-12px] rounded-full bg-[#363646]"
                                : "left-[-12px] rounded-full bg-[#957AAA]"
                            }
                        `} 
                    />
                </>
            )}

        </div>
    );
}
