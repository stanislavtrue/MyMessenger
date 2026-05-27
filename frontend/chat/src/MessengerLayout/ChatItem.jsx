import { useRipple } from "../hooks/useRipple";

export const ChatItem = ( {chat, selectedChatId, setSelectedChatId} ) => {
    const isSelected = selectedChatId === chat.id;
    const { ripples, createRipple } = useRipple();

    const handleClick = (e) => {
        createRipple(e);

        setTimeout(() => {
            setSelectedChatId(chat.id);
        }, 80);
    };

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

            <div className="w-12 h-12 rounded-full bg-[#5A4282] flex items-center justify-center text-white text-2xl! z-10 shrink-0">
                {chat.name[0]}
            </div>

            <div className="flex flex-col min-w-0 flex-1 z-10">
                <span className="text-white font-medium text-lg! truncate">
                    {chat.name}
                </span>
        
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
                    {chat.lastMessage}
                </span>
            </div>

        </div>
    );
}
