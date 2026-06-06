import { Heading } from "@chakra-ui/react";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

export const ChatArea = ({ selectedChat, onSendMessage, sidebarWidth, isMobile, onBack}) => {

    if(!selectedChat) {
        return (
            <div className="flex-1 h-screen bg-[#111111] flex justify-center items-center">
                <div className="w-fit px-3! py-1! bg-[#1F1F28] rounded-3xl">
                    <Heading size="sm" fontFamily="B612" fontWeight="medium" className="text-center">Select a chat to start messaging</Heading>
                </div>
            </div>
        );
    }

    const contentStyle = {
        maxWidth: isMobile ? "100%" : `${960 - ((sidebarWidth - 13) / 20) * 240}px`,
        width: "100%"
    };

    return (
        <div className="flex-1 h-screen bg-[#111111] flex flex-col min-w-0">
            <ChatHeader chat={selectedChat} isMobile={isMobile} onBack={onBack} />
            
            <div className="flex-1 overflow-y-auto messages-scroll px-4!">
                <div style={contentStyle} className="w-full h-full mx-auto! transition-all duration-75 ease-out">
                    <MessageList messages={selectedChat.messages} />
                </div>
            </div>
            
            <div className="pb-4! px-4!">
                <div style={contentStyle} className="mx-auto! transition-all duration-75 ease-out">
                    <MessageInput onSendMessage={onSendMessage}/>
                </div>
            </div>
        </div>
    );
}
