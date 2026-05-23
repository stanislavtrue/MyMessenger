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
            px-8!
            flex items-center
            focus-within:ring-2
            focus-within:ring-[#957AAA]
            transition-all duration-300
        ">
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if(e.key == "Enter") {
                        handleSend();
                    }
                }}
                className="
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
                    color: "#52526B"
                }}
            />

        </div>
    );
}
