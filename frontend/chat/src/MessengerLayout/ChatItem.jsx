export const ChatItem = ( {chat, selectedChatId, setSelectedChatId} ) => {
    const isSelected = selectedChatId === chat.id;

    return (
        <div 
            onClick={() => setSelectedChatId(chat.id)}
            className={`
                transition-colors 
                flex 
                items-center 
                gap-2
                px-2!
                py-2!
                cursor-pointer
                w-[97%] rounded-2xl
                m-auto!
                
                ${isSelected
                    ? "bg-[#363646] hover:bg-[#363646]"
                    : "hover:bg-[#282836]"
                }
            `}
        >

            <div className="w-12 h-12 rounded-full bg-[#5A4282] flex items-center justify-center text-white !text-2xl">
                {chat.name[0]}
            </div>

            <div className="flex flex-col ">
                <span className="text-white font-medium !text-lg">
                    {chat.name}
                </span>
        
                <span className="text-[#52526B] !text-sm">
                    {chat.lastMessage}
                </span>
            </div>

        </div>
    );
}
