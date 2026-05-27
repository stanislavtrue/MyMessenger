import { useEffect, useState } from "react";
import { ChatArea } from "./MessengerLayout/ChatArea";
import { Sidebar } from "./MessengerLayout/Sidebar";
import { mockChats } from "./data/mockChats";
import { useMessenger } from "./hooks/useMessenger";

function TestPage() {
    const {chats, selectedChat, selectedChatId, setSelectedChatId, handleSendMessage} = useMessenger();

    return (
        <div className="h-screen flex overflow-hidden">
            <Sidebar chats={chats} selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />
            <ChatArea selectedChat={selectedChat} onSendMessage={handleSendMessage} />
        </div>
        
    );
};

export default TestPage;
