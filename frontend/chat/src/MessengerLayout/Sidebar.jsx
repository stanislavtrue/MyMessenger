import { ChatItem } from "./ChatItem"

export const Sidebar = ({ selectedChat, setSelectedChat }) => {
    const chats = [
        {
            id: 1,
            name: "John Sina",
            lastMessage: "Goodbuy!"
        },
        {
            id: 2,
            name: "Elon Musk",
            lastMessage: "Hi, how r u?"
        },
        {
            id: 3,
            name: "Cristiano Ronaldo",
            lastMessage: "Go football!?"
        },
        {
            id: 4,
            name: "Noname",
            lastMessage: "Есть работа курьером, зп-300000к"
        }
    ];

    return (
        <div className="w-1/3 h-screen bg-[#1F1F28]">

            <div className="!pl-18 !pr-2 !py-2 text-center">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-[#16161D] rounded-3xl !py-2 !px-4 !text-sm text-white outline-none"
                />
            </div>

            <div className="flex flex-col overflow-y-auto">
                {chats.map((chat) => (
                    <ChatItem 
                        key={chat.id} 
                        chat={chat} 
                        setSelectedChat={setSelectedChat}
                        selectedChat={selectedChat}
                    />
                        
                ))}
            </div>

        </div>
    );
}
