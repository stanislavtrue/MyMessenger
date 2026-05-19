export const ChatItem = ( {chat, selectedChat, setSelectedChat} ) => {
    const isSelected = selectedChat?.id === chat.id;

    return (
        <div 
            onClick={() => setSelectedChat(chat)}
            className={`
                transition-colors 
                flex 
                items-center 
                gap-4 
                !px-4 
                !py-2
                cursor-pointer

                ${isSelected
                    ? "bg-[#363646] hover:bg-[#363646]"
                    : "hover:bg-[#282836]"
                }
            `}
        >

            <div className="w-12 h-12 rounded-full bg-[#957AAA] flex items-center justify-center text-white !text-2xl">
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
