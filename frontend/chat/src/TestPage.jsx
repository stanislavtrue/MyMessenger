import { ChatArea } from "./MessengerLayout/ChatArea";
import { Sidebar } from "./MessengerLayout/Sidebar";
import { MessengerProvider, useMessengerContext } from "./context/MessengerContext";

export const MessengerContent = () => {
    const { chats, selectedChat, selectedChatId, sidebarWidth, windowWidth, setSidebarWidth, setSelectedChatId, handleSendMessage } = useMessengerContext();

    const isMobile = windowWidth < 768;

    return (
        <div className="h-screen flex overflow-hidden bg-[#111111] relative">
            
            {(!isMobile || !selectedChatId) && (
                <Sidebar 
                    sidebarWidth={sidebarWidth} 
                    setSidebarWidth={setSidebarWidth} 
                    chats={chats} 
                    isMobile={isMobile}
                    selectedChatId={selectedChatId} 
                    setSelectedChatId={setSelectedChatId} 
                />
            )}

            {(!isMobile || selectedChatId) && (
                <ChatArea  
                    selectedChat={selectedChat} 
                    onSendMessage={handleSendMessage} 
                    sidebarWidth={sidebarWidth}
                    isMobile={isMobile}
                    onBack={() => setSelectedChatId(null)}
                />
            )}
        </div>
    );

}

function TestPage() {
    return (
        <MessengerProvider>
            <MessengerContent />
        </MessengerProvider>
    );
};

export default TestPage;
