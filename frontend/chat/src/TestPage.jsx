import { useState } from "react";
import { ChatArea } from "./MessengerLayout/ChatArea";
import { Sidebar } from "./MessengerLayout/Sidebar";

function TestPage() {
    const [chats, setChats] = useState([
            {
                id: 1,
                name: "John Cena",
                lastMessage: "Goodbuy!",
                messages: [
                    {
                        id: 1,
                        text: "Hello my friend!",
                        time: "12.23",
                        isOwnMessage: false
                    },
                    {
                        id: 2,
                        text: "Hi)",
                        time: "12.23",
                        isOwnMessage: true
                    },
                    {
                        id: 3,
                        text: "Hello my friend! How are you??????????",
                        time: "12.24",
                        isOwnMessage: false
                    },
                    {
                        id: 4,
                        text: "Hello my friend!",
                        time: "12.24",
                        isOwnMessage: true
                    },
                    {
                        id: 5,
                        text: "Lalala",
                        time: "12.24",
                        isOwnMessage: true
                    },
                    {
                        id: 6,
                        text: "Hello my friend!",
                        time: "12.25",
                        isOwnMessage: false
                    },
                    {
                        id: 7,
                        text: "Hello my friend!",
                        time: "12.27",
                        isOwnMessage: false
                    },
                    {
                        id: 8,
                        text: "Hello my friend!",
                        time: "12.28",
                        isOwnMessage: false
                    },
                    {
                        id: 9,
                        text: "Elon Reeve Musk is a businessman and public official known for his leadership of Tesla and SpaceX. Musk has been the wealthiest person in the world since 2025; as of May 2026, Forbes estimates his net worth to be US$788 billion. ",
                        time: "12.28",
                        isOwnMessage: false
                    },
                    {
                        id: 10,
                        text: "Elon Reeve Musk is a businessman and public official known for his leadership of Tesla and SpaceX. Musk has been the wealthiest person in the world since 2025; as of May 2026, Forbes estimates his net worth to be US$788 billion. ",
                        time: "12.30",
                        isOwnMessage: true
                    },
                    {
                        id: 11,
                        text: "John Felix Anthony Cena is an American actor, retired professional wrestler, and former rapper. In professional wrestling, he is signed to WWE as a brand ambassador. He is best known for his in-ring career from 2001 to 2025, where he is recognized by WWE as a record 17-time world champion. ",
                        time: "12.41",
                        isOwnMessage: false
                    },
                ],
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
    ]);
    
    const [selectedChatId, setSelectedChatId] = useState(null);
    
    const selectedChat=chats.find(
        chat => chat.id === selectedChatId
    );

    const handleSendMessage = (text) => {
        const newMessage = {
            id: Date.now(),
            text: text,
            time: "12:45",
            isOwnMessage: true

        };

        const updatedChats = chats.map(chat => {
            if(chat.id === selectedChatId) {
                return {
                    ...chat,
                    lastMessage: text,
                    messages: [
                        ...chat.messages,
                        newMessage
                    ]
                };
            }

            return chat;
        });

        setChats(updatedChats);
    };

    return (
        <div className="h-screen flex">
            <Sidebar chats={chats} selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />
            <ChatArea selectedChat={selectedChat} onSendMessage={handleSendMessage} />
        </div>
        
    );
};

export default TestPage;
