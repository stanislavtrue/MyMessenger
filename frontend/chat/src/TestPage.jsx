import { useState } from "react";
import { ChatArea } from "./MessengerLayout/ChatArea";
import { Sidebar } from "./MessengerLayout/Sidebar";

function TestPage() {
    const [selectedChat, setSelectedChat] = useState(null);

    return (
        <div className="h-screen flex">
            <Sidebar selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
            <ChatArea selectedChat={selectedChat} />
        </div>
        
    );
};

export default TestPage;
