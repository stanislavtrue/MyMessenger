import { MdSend } from "react-icons/md";
import { SlActionUndo } from "react-icons/sl"
import { Mic, Smile, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useMessengerContext } from "../context/MessengerContext";
import EmojiPicker from "emoji-picker-react"

export const MessageInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState("");
    const { replyToMessage, replyPreview, closeReply, isEmojiPickerOpen, setIsEmojiPickerOpen } = useMessengerContext();

    const hidePickerTimeout = useRef(null);
    const showPickerTimeout = useRef(null);

    const handleEmojiMouseEnter = () => {
        clearTimeout(hidePickerTimeout.current);

        showPickerTimeout.current = setTimeout(() => {
            setIsEmojiPickerOpen(true);
        }, 100);
    };
    
    const handleEmojiMouseLeave = () => {
        clearTimeout(showPickerTimeout.current);

        hidePickerTimeout.current = setTimeout(() => {
            setIsEmojiPickerOpen(false);
        }, 300);
    };

    useEffect(() => {
        return () => {
            clearTimeout(hidePickerTimeout.current);
            clearTimeout(showPickerTimeout.current);
        };
    }, []);

    const hasMessage = message.trim().length > 0;

    const handleSend = () => {
        const text = message.trim();
        if (!text) return;

        onSendMessage(text);

        setMessage("");
    };

    return (
        <div className="flex relative items-end gap-2 my-2!">
            <div className={`
                    flex-1
                    min-w-0
                    bg-[#1F1F28]    
                    rounded-2xl
                    rounded-br-none
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

                    <div
                        className="relative select-none"
                        onMouseEnter={handleEmojiMouseEnter}
                        onMouseLeave={handleEmojiMouseLeave}
                    >
                        <Smile size={26} className={`cursor-pointer transition-colors ${isEmojiPickerOpen ? "text-[#8F5EB5]" : "text-[#5F5F7C]"}`}/>

                            <div 
                                className={`
                                    absolute bottom-10 left-0 z-50
                                    origin-bottom-left
                                    transition-all duration-200 ease-out

                                    ${isEmojiPickerOpen
                                        ? "opacity-100 scale-100 translate-y-0"
                                        : "opacity-0 scale-75 translate-y-2 pointer-events-none"
                                    }
                                `}
                            >
                                <EmojiPicker
                                    theme="dark"
                                    searchDisabled
                                    lazyLoadEmojis
                                    width={380}
                                    height={340}
                                    emojiStyle="apple"
                                    previewConfig={{
                                        showPreview:false
                                    }}
                                    onEmojiClick={(emojiData) => {
                                        setMessage(prev => prev + emojiData.emoji);
                                    }}
                                    className="shadow-xl shadow-black/40"
                                />
                            </div>

                    </div>

                    <input
                        id="message-input"
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

            <div 
                onClick={hasMessage ? handleSend : null}
                className={`
                    h-12 w-12 
                    rounded-full 
                    bg-[#1F1F28]
                    flex items-center justify-center
                    cursor-pointer
                    hover:bg-[#8F5EB5]
                    group
                    shrink-0
                    transition-colors
                `}
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
}
