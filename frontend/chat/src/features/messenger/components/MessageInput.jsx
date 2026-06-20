import { MdSend } from "react-icons/md";
import { Mic, Smile } from "lucide-react";
import { useState, useRef } from "react";
import { useMessengerContext } from "../context/MessengerContext";
import { useEmojiPickerHover } from "../hooks/useEmojiPickerHover";
import { ReplyPreview } from "@/features/messenger/components/ReplyPreview";
import EmojiPicker from "emoji-picker-react"

export const MessageInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState("");
    const inputRef = useRef(null);

    const { 
        replyToMessage, replyPreview, closeReply, 
        isEmojiPickerOpen, setIsEmojiPickerOpen 
    } = useMessengerContext();

    const { handleMouseEnter, handleMouseLeave } = useEmojiPickerHover(isEmojiPickerOpen, setIsEmojiPickerOpen);

    const trimmedMessage = message.trim();
    const hasMessage = trimmedMessage.length > 0;

    const handleSend = () => {
        const text = trimmedMessage;
        if (!text) return;

        onSendMessage(text);
        setMessage("");
        inputRef.current?.focus();
    };

    const handleEmojiClick = (emojiData) => {
        setMessage(prev => prev + emojiData.emoji);
        inputRef.current?.focus();
    };

    return (
        <div className="flex relative items-end gap-2 my-2!">
            <div className="
                flex-1 flex flex-col min-w-0 
                bg-[#1F1F28] rounded-2xl rounded-br-none
                focus-within:ring-2 focus-within:ring-[#957AAA]
                transition-all duration-300
            ">
                <ReplyPreview
                    replyPreview={replyPreview}
                    replyToMessage={replyToMessage}
                    onClose={closeReply}
                />

                <div className="flex items-center my-auto! px-4! h-12">

                    <div
                        className="relative select-none"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Smile size={26} className={`cursor-pointer transition-colors ${isEmojiPickerOpen ? "text-[#8F5EB5]" : "text-[#5F5F7C]"}`}/>

                        <div className={`
                            absolute bottom-10 left-0 z-50
                            origin-bottom-left
                            transition-all duration-200 ease-out

                            ${isEmojiPickerOpen
                                ? "opacity-100 scale-100 translate-y-0"
                                : "opacity-0 scale-75 translate-y-2 pointer-events-none"
                            }
                        `}>
                            <EmojiPicker
                                theme="dark"
                                searchDisabled
                                lazyLoadEmojis
                                width={380}
                                height={340}
                                emojiStyle="apple"
                                previewConfig={{ showPreview: false }}
                                onEmojiClick={handleEmojiClick}
                                className="shadow-xl shadow-black/40"
                            />
                        </div>
                    </div>

                    <input
                        ref={inputRef}
                        id="message-input"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key == "Enter") handleSend();
                        }}
                        className="
                            pl-3! w-full h-full
                            bg-transparent outline-none!
                            text-xl placeholder-[#5F5F7C]!
                        "
                        type="text"
                        placeholder="Write a message..."
                    />
                </div>
            </div>

            <div 
                onClick={hasMessage ? handleSend : null}
                className="
                    h-12 w-12 rounded-full bg-[#1F1F28]
                    flex items-center justify-center
                    cursor-pointer hover:bg-[#8F5EB5]
                    group shrink-0 transition-colors
                "
            >
                {hasMessage ? (
                    <MdSend 
                        size={24} 
                        className={`text-[#8F5EB5] transition-colors group-hover:text-white ${hasMessage ? "animate-pulse-send" : ""}`}
                    />
                ) : (
                    <Mic 
                        size={24} 
                        className={`text-[#5F5F7C] transition-colors group-hover:text-white ${hasMessage ? "" : "animate-pulse-send"}`}
                    />
                )}
            </div>
        </div>
    );
};
