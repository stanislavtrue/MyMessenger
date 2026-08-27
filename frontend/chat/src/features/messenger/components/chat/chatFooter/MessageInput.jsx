import { useMessengerContext } from "@/features/messenger/context/MessengerContext";
import { MdSend } from "react-icons/md";
import { Mic, Smile } from "lucide-react";
import { useState, useRef } from "react";
import { useEmojiPickerHover } from "../../../hooks/useEmojiPickerHover";
import EmojiPicker from "emoji-picker-react"
import { ReplyPreview } from "./ReplyPreview";
import connection from "@/features/messenger/services/chatHub";

export const MessageInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState("");
    const inputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);

    const { 
        replyToMessage, replyPreview, closeReply, selectedChatId, 
        isEmojiPickerOpen, setIsEmojiPickerOpen
    } = useMessengerContext();

    const { handleMouseEnter, handleMouseLeave } = useEmojiPickerHover(isEmojiPickerOpen, setIsEmojiPickerOpen);

    const trimmedMessage = message.trim();
    const hasMessage = trimmedMessage.length > 0;

    const handleInputChange = (e) => {
        const text = e.target.value;
        setMessage(text);

        if (!selectedChatId) return;

        if (!isTypingRef.current && text.trim().length > 0) {
            isTypingRef.current = true;
            connection.invoke("StartTyping", selectedChatId);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            if (isTypingRef.current) {
                isTypingRef.current = false;
                connection.invoke("StopTyping", selectedChatId);
            }
        }, 2500);
    };

    const handleSend = () => {
        if (typingTimeoutRef.current)
            clearTimeout(typingTimeoutRef.current);

        isTypingRef.current = false;
    
        connection.invoke("StopTyping", selectedChatId);

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
        <div className="flex relative items-end gap-2">
            <div className="
                flex-1 flex flex-col min-w-0 
                bg-[#111111] rounded-3xl
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
                        <Smile size={26} className={`cursor-pointer transition-colors ${isEmojiPickerOpen ? "text-[#8F5EB5]" : "text-[#7F88C0]"}`}/>

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
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key == "Enter") handleSend();
                        }}
                        className="
                            pl-3! w-full h-full
                            bg-transparent outline-none!
                            text-xl placeholder-[#7F88C0]/80!
                        "
                        type="text"
                        placeholder="Message"
                    />
                </div>
            </div>

            <div 
                onClick={hasMessage ? handleSend : null}
                className="
                    size-12 rounded-full bg-[#111111]
                    flex items-center justify-center
                    cursor-pointer hover:bg-[#8F5EB5]
                    group shrink-0 transition-colors
                "
            >
                {hasMessage ? (
                    <MdSend 
                        size={24} 
                        className={`text-[#7F88C0] transition-colors group-hover:text-white ${hasMessage ? "animate-pulse-send" : ""}`}
                    />
                ) : (
                    <Mic 
                        size={24} 
                        className={`text-[#7F88C0] transition-colors group-hover:text-white ${hasMessage ? "" : "animate-pulse-send"}`}
                    />
                )}
            </div>
        </div>
    );
};
