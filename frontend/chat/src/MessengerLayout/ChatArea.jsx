import { Heading } from "@chakra-ui/react";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";

export const ChatArea = ({ selectedChat }) => {
    
    if(!selectedChat) {
        return (
            <div className="w-2/3 h-screen bg-[#16161D] flex justify-center items-center">
                <div className="w-fit !px-3 !py-1 bg-[#1F1F28] rounded-3xl">
                    <Heading size="sm" fontFamily="B612" fontWeight="medium" className="text-center">Select a chat to start messaging</Heading>
                </div>
            </div>
        );
    }

    return (
        <div className="w-2/3 h-screen bg-[#16161D] flex flex-col">
            <ChatHeader chat={selectedChat} />

            <div className="flex-1">
                Messages
            </div>

            <MessageInput />
        </div>
    );
}
