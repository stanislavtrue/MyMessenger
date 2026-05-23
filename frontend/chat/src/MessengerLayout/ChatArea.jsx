import { Heading } from "@chakra-ui/react";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

export const ChatArea = ({ selectedChat, onSendMessage}) => {
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

            <div className="flex-1 overflow-y-auto messages-scroll">
                <div className="w-full h-full max-w-180 mx-auto!">
                    <MessageList messages={selectedChat.messages} />
                </div>
            </div>

            <div className="pb-4!">
                <div className="w-full max-w-180 mx-auto!">
                    <MessageInput onSendMessage={onSendMessage} />
                </div>
            </div>

        </div>
    );
}
