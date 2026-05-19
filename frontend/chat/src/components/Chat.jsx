import { Button, CloseButton, Heading, Input } from "@chakra-ui/react"
import { Message } from "./Message";
import { useState, useRef, useEffect } from "react";

export const Chat = ({messages, chatRoom, closeChat, sendMessage}) => {
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const onSendMessage = () => {
        if (!message.trim()) return;

        sendMessage(message);
        setMessage("");
    }

    return (
        <div className="w-1/2 bg-white !p-8 rounded shadow-lg">
            <div className="flex flex-row justify-between !mb-5">
                <Heading color="#000000ff" size="lg">{chatRoom}</Heading>
                <CloseButton onClick={closeChat} />
            </div>
            <div className="flex flex-col overflow-auto scroll-smooth h-96 gap-3 pb-3">
                {messages.map((messageInfo, index) => (
                    <Message messageInfo={messageInfo} key={index} />
                ))}
                <span ref={messagesEndRef}/>
            </div>
            <div className="flex gap-3">
                <Input 
                    type="text" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Enter message"
                    color="black"
                />
                <Button className="!bg-blue-500 hover:!bg-blue-600 !text-white" onClick={onSendMessage}>
                    Send
                </Button>
            </div>
        </div>
    );
}
