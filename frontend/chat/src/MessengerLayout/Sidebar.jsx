import { ChatItem } from "./ChatItem"

export const Sidebar = ({ selectedChat, setSelectedChat }) => {
    const chats = [
        {
            id: 1,
            name: "John Sina",
            lastMessage: "Goodbuy!",
            messages: [
                {
                    id: 1,
                    text: "Hello my friend!",
                    isOwnMessage: false
                },
                {
                    id: 2,
                    text: "Hi)",
                    isOwnMessage: true
                },
                {
                    id: 3,
                    text: "Hello my friend!",
                    isOwnMessage: false
                },
                {
                    id: 4,
                    text: "Hello my friend!",
                    isOwnMessage: true
                },
                {
                    id: 5,
                    text: "Lalala",
                    isOwnMessage: true
                },
                {
                    id: 6,
                    text: "Hello my friend!",
                    isOwnMessage: false
                },
                {
                    id: 7,
                    text: "Hello my friend!",
                    isOwnMessage: false
                },
                {
                    id: 8,
                    text: "Hello my friend!",
                    isOwnMessage: false
                },
            ]
        },
        {
            id: 2,
            name: "Elon Musk",
            lastMessage: "Hi, how r u?",
            messages: []
        },
        {
            id: 3,
            name: "Cristiano Ronaldo",
            lastMessage: "Go football!?",
            messages: []
        },
        {
            id: 4,
            name: "Noname",
            lastMessage: "Есть работа курьером, зп-300000к",
            messages: []
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
