import { BsExclamationCircleFill } from "react-icons/bs";
import { MessengerProvider, useMessengerContext } from "@/features/messenger/context/MessengerContext";
import { ChatArea } from "@/features/messenger/components/chat/ChatArea";
import { Sidebar } from "./features/messenger/components/sidebar/Sidebar";
import { MessengerSceleton } from "./features/messenger/components/MessengerSceleton";

export const MessengerContent = () => {
    const { chats, selectedChat, selectedChatId, sidebarWidth, windowWidth, setSidebarWidth, setSelectedChatId, handleSendMessage, toast, isLoadingUser } = useMessengerContext();

    const isMobile = windowWidth < 768;

    if (isLoadingUser) {
        return (
            <MessengerSceleton />
        );
    }

    return (
        <div className="h-screen flex overflow-hidden relative bg-[#111111]" >
            <div
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(135deg,#717171,#313131,#515151)",

                    WebkitMaskImage: "url('/background.png')",
                    WebkitMaskRepeat: "repeat",
                    WebkitMaskSize: "450px",

                    maskImage: "url('/background.png')",
                    maskRepeat: "repeat",
                    maskSize: "450px",

                    opacity: 0.3
                }}
            />

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

function App() {
    return (
        <MessengerProvider>
            <MessengerContent />
        </MessengerProvider>
    );
};

export default App;
