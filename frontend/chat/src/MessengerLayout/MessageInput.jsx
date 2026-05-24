import { Mic, Paperclip, Smile } from "lucide-react";
import { useState } from "react";

export const MessageInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if(message.trim() === "") return;

        onSendMessage(message);

        setMessage("");
    };

    return (
        <div className="
            h-12
            bg-[#1F1F28]    
            rounded-2xl
            my-2!  
            px-4!
            flex items-center
            focus-within:ring-2
            focus-within:ring-[#957AAA]
            transition-all duration-300
        ">

            <Smile className="cursor-pointer text-[#5F5F7C]"/>

            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if(e.key == "Enter") {
                        handleSend();
                    }
                }}
                className="
                    pl-3!
                    w-full
                    h-full
                    bg-transparent
                    outline-none!
                    text-xl
                "
                type="text"
                placeholder="Write a message..."
                color="white"
                border="none"
                _placeholder={{
                    color: "#5F5F7C"
                }}
            />
            <Paperclip size={50} className="cursor-pointer text-[#5F5F7C] px-3!"/>

            <Mic size={42} className="cursor-pointer text-[#5F5F7C] pr-3!" />

        </div>
    );
}
