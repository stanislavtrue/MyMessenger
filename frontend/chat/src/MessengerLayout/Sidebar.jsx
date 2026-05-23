import { ChatItem } from "./ChatItem"

export const Sidebar = ({ chats, selectedChatId, setSelectedChatId }) => {

    return (
        <div className="w-1/3 h-screen border-r! border-[#282836]! bg-[#1F1F28]">

            <div className="
                !pl-18 !pr-2 !py-2 
                text-center 
            ">
                <div className="focus-within:ring-2 focus-within:ring-[#957AAA] transition-all duration-300 rounded-3xl">
                    <input
                        className="
                            w-full 
                            bg-[#16161D] 
                            rounded-3xl 
                            !py-2 !px-4 
                            !text-sm text-white 
                            outline-none!
                        "
                        type="text"
                        placeholder="Search"
                        border="none"
                        _placeholder={{
                        color: "#52526B"
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-col overflow-y-auto">
                {chats.map((chat) => (
                    <ChatItem 
                        key={chat.id} 
                        chat={chat} 
                        setSelectedChatId={setSelectedChatId}
                        selectedChatId={selectedChatId}
                    />
                        
                ))}
            </div>

        </div>
    );
}
