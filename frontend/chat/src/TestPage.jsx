import { ChatArea } from "./MessengerLayout/ChatArea";
import { Sidebar } from "./MessengerLayout/Sidebar";
import { useMessenger } from "./hooks/useMessenger";

function TestPage() {
    const {chats, selectedChat, selectedChatId, sidebarWidth, windowWidth, contextMenu, setContextMenu, setSidebarWidth, setSelectedChatId, handleSendMessage} = useMessenger();

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
                    contextMenu={contextMenu}
                    setContextMenu={setContextMenu}
                    onBack={() => setSelectedChatId(null)}
                    isOpen={!!selectedChatId}
                />
            )}
        </div>
        
    );
};

export default TestPage;
