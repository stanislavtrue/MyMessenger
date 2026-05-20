import { Heading } from "@chakra-ui/react";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

export const ChatArea = ({ selectedChat }) => {
    const messages = [
        {
            id: 1,
            userName: "Elon Musk",
            text: "Hello",
            isOwnMessage: false,
            time: "12.35"
        },
        {
            id: 2,
            userName: "Robert",
            text: "Hi",
            isOwnMessage: true,
            time: "12.36"
        },
        {
            id: 3,
            userName: "Elon Musk",
            text: "How are you? I have an offer for you!",
            isOwnMessage: false,
            time: "12.37"
        },
        {
            id: 4,
            userName: "Robert",
            text: "Wow, it`s fine, I`m interested on it!",
            isOwnMessage: true,
            time: "12.39"
        },
        {
            id: 5,
            userName: "Robert",
            text: "Wow, it`s fine, I`m interested on it!",
            isOwnMessage: true,
            time: "12.39"
        },
        {
            id: 6,
            userName: "Robert",
            text: "Wow, it`s fine, I`m interested on it!",
            isOwnMessage: false,
            time: "12.39"
        },
        {
            id: 7,
            userName: "Robert",
            text: "Wow, it`s fine, I`m interested on it!",
            isOwnMessage: true,
            time: "12.39"
        },
        {
            id: 8,
            userName: "Robert",
            text: "Wow, it`s fine, I`m interested on it!",
            isOwnMessage: true,
            time: "12.39"
        },
        {
            id: 9,
            userName: "Robert",
            text: "Wow, it`s fine, I`m interested on it!",
            isOwnMessage: false,
            time: "12.39"
        },
        {
            id: 10,
            userName: "Robert",
            text: "Wow, it`s fine, I`m interested on it!",
            isOwnMessage: true,
            time: "12.39"
        },
        {
            id: 11,
            userName: "Robert",
            text: "Wow, it`s fine, I`m interested on it!",
            isOwnMessage: true,
            time: "12.39"
        },
        {
            id: 12,
            userName: "Robert",
            text: "Wow, it`s fine, I`m interested on it!",
            isOwnMessage: false,
            time: "12.39"
        },
    ];
    
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

            <div className="flex-1 overflow-y-auto min-h-0">
                <MessageList messages={messages} />
            </div>

            <div className="pb-4!">
                <MessageInput />
            </div>

        </div>
    );
}
