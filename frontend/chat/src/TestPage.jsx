import { BsExclamationCircleFill } from "react-icons/bs";
import { MessengerProvider, useMessengerContext } from "@/features/messenger/context/MessengerContext";
import { ChatArea } from "@/features/messenger/components/chat/ChatArea";
import { Sidebar } from "./features/messenger/components/sidebar/Sidebar";
import connection from "./features/messenger/services/chatHub";
import { useEffect } from "react";

export const MessengerContent = () => {
    const { chats, selectedChat, selectedChatId, sidebarWidth, windowWidth, setSidebarWidth, setSelectedChatId, handleSendMessage, toast } = useMessengerContext();

    const isMobile = windowWidth < 768;

    const chatId = "3d3e8f29-d7c6-42cb-9150-8136810fb347";

    useEffect(() => {
        const connect = async () => {
            await connection.start();

            console.log("Connected to ChatHub");

            await connection.invoke("JoinChat", chatId);

            console.log("Joined chat");
        };

        connect().catch(error => console.error(error));
    }, []);


    return (
        <div className="h-screen flex overflow-hidden relative" >
            <div
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(135deg,#330033,#6600ff,#ff9900)",

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

function TestPage() {
    return (
        <MessengerProvider>
            <MessengerContent />
        </MessengerProvider>
    );
};

export default TestPage;
