export const MessageBubble = ({ message, isFirstMessage, isLastMessage }) => {

    let radiusClass = "";
    let spacingClass = "";

    if (isFirstMessage && isLastMessage)
    {
        spacingClass="mb-3!"
    }

    if (!isFirstMessage && !isLastMessage) 
    {
        if (message.isOwnMessage)
        {
            radiusClass="rounded-br-sm rounded-tr-sm"
        }
        else
        {
            radiusClass="rounded-bl-sm rounded-tl-sm"
        }
    }
    else if (isFirstMessage && !isLastMessage)
    {
        if (message.isOwnMessage)
        {
            radiusClass="rounded-br-sm"
        }
        else 
        {
            radiusClass="rounded-bl-sm"
        }
    }
    else if (!isFirstMessage && isLastMessage)
    {
        spacingClass="mb-3!"
        if (message.isOwnMessage)
        {
            radiusClass="rounded-tr-sm"
        }
        else
        {
            radiusClass="rounded-tl-sm"
        }
    }

    return (
        <div className={`
                relative
                w-fit
                max-w-[70%]
                rounded-2xl
                
                py-1! px-3! mb-1!
                ${radiusClass}

                ${spacingClass}
                
                ${message.isOwnMessage
                    ? "ml-auto! mr-4! bg-[#363646]"
                    : "mr-auto! ml-4! bg-[#5A4282]"
                }
            `}
        >
            
            <div className="flex items-end gap-2">

                <span className="text-white whitespace-pre-wrap! overflow-hidden">
                    {message.text}
                </span>

                <span className="text-xs! opacity-50 leading-none">
                    {message.time}
                </span>

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
                                : "left-[-6px] rounded-full bg-[#5A4282]"
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
                                : "left-[-12px] rounded-full bg-[#5A4282]"
                            }
                        `} 
                    />
                </>
            )}

        </div>
    );
}
