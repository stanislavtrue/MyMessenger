import { SlActionUndo } from "react-icons/sl"
import { Smile, X } from "lucide-react";
import { useState } from "react";
import { useMessengerContext } from "../context/MessengerContext";

export const MessageInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState("");
    const { replyToMessage, setReplyToMessage, replyPreview, openReply, closeReply } = useMessengerContext();

    const handleSend = () => {
        if(message.trim() === "") return;

        onSendMessage(message);

        setMessage("");
    };

    return (
        <div className={`
                my-2!
                bg-[#1F1F28]    
                rounded-2xl
                flex flex-col
                focus-within:ring-2
                focus-within:ring-[#957AAA]
                transition-all duration-300
            `}
        >
            {replyPreview && (
                <div 
                    className={`
                        overflow-hidden
                        transition-all duration-200 ease-out
                        
                        ${replyToMessage
                            ? "max-h-16 opacity-100 translate-y-0"
                            : "max-h-0 opacity-0 -translate-y-4"
                        }
                    `}
                >
                    <div className="flex items-center justify-between px-4! pt-2! my-auto! select-none">
                        <div className="flex flex-1 items-center gap-4 min-w-0">
                            <SlActionUndo size={22} strokeWidth={40} className="text-[#8F5EB5] shrink-0"/>
                            <div className="flex flex-col justify-center h-10 flex-1 min-w-0 bg-[#8F5EB5]/20 rounded-sm border-l-4! border-[#8F5EB5]! shrink-0 cursor-pointer hover:bg-[#8F5EB5]/15">
                                <span className="ml-2! text-sm! text-[#C083F0]">User</span>
                                <span className="ml-2! text-sm! truncate pr-2!">{replyPreview.text}</span>
                            </div>
                        </div>
                        <button
                            onClick={closeReply}
                            className="text-[#8F5EB5]/80! hover:text-[#8F5EB5]! transition-colors cursor-pointer ml-3! shrink-0"
                        >
                            <X size={24} className=""/>
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-center my-auto! px-4! h-12">

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
                        placeholder-[#5F5F7C]!
                    "
                    type="text"
                    placeholder="Write a message..."
                    color="white"
                    border="none"
                />

            </div>

        </div>
    );
}
