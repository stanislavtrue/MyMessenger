import { BsExclamationCircleFill } from "react-icons/bs";
import { Sidebar } from "@/features/messenger/components/Sidebar";
import { MessengerProvider, useMessengerContext } from "@/features/messenger/context/MessengerContext";
import { ChatArea } from "@/features/messenger/components/ChatArea";

export const MessengerContent = () => {
    const { chats, selectedChat, selectedChatId, sidebarWidth, windowWidth, setSidebarWidth, setSelectedChatId, handleSendMessage, toast } = useMessengerContext();

    const isMobile = windowWidth < 768;

    return (
        <div 
            className="h-screen flex overflow-hidden relative"
            style={{
                backgroundImage: "url('/bg-pattern.png')",
                backgroundRepeat: "repeat",
                backgroundPosition: "center top",
                backgroundSize: "auto"
            }}
        >

            {toast && (
                <div 
                    key={toast.id}
                    style={{fontFamily: "Roboto"}}
                    className="fixed flex items-center h-14 w-80 left-1/2 top-16 -translate-x-1/2 px-4! py-2! gap-3 rounded-xl bg-[#000000]/70 backdrop-blur-xl z-999 select-none animate-toast"
                >
                    <BsExclamationCircleFill size={30}/>
                    <span className="font-light!">{toast.text}</span>
                </div>
            )}
            
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
