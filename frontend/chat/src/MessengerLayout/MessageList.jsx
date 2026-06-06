import { formatDividerDate } from "../utils/formatDividerDate";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { useContextMenu } from "../hooks/useContextMenu";
import { Copy, Forward, Pin, Reply, Trash } from "lucide-react";
import { useMessengerContext } from "../context/MessengerContext";

export const MessageList = ({ messages }) => {
    const { contextMenu, setContextMenu } = useMessengerContext();
    const { showMenu, closeMenu } = useContextMenu(contextMenu, setContextMenu);

    const handleAction = (actionType, message) => {
        closeMenu();

        if (actionType === "copy") {
            navigator.clipboard.writeText(message.text);
        }
    }

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    return (
        <div className="
            relative
            flex flex-col 
            w-full h-full 
            py-4!
        ">
            {contextMenu.visible && (
                <div 
                    onClick={closeMenu}
                    className="fixed inset-0 z-40"
                />
            )}

            <div className="mt-auto! w-full flex flex-col">

                {messages.map((message, index) => {
                    const previousMessage = messages[index - 1];
                    const nextMessage = messages[index + 1];

                    const showDivider = !previousMessage || previousMessage.date !== message.date;

                    const isFirstMessage = 
                        !previousMessage ||
                        previousMessage.isOwnMessage !== message.isOwnMessage ||
                        showDivider;

                    const isLastMessage =
                        !nextMessage ||
                        nextMessage.isOwnMessage !== message.isOwnMessage ||
                        nextMessage.date !== message.date;

                    return (
                        <div key={message.id || index} className="w-full flex flex-col">

                            {showDivider && (
                                <div className="flex justify-center my-4! select-none pointer-events-none">
                                    <div style={{fontFamily: "Roboto"}} className="px-2! py-1! bg-[#1F1F28] text-sm! font-semibold! rounded-2xl">
                                        {formatDividerDate(message.date)}
                                    </div>
                                </div>
                            )}

                            <div 
                                onContextMenu={(e) => showMenu(e, message)}
                                className="w-full flex flex-col"
                            >
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    isFirstMessage={isFirstMessage}
                                    isLastMessage={isLastMessage}
                                />
                            </div>
                        </div>
                    );
                })}
            
                <div ref={bottomRef} />

            </div>

                <div
                    style={{
                        top: contextMenu.y,
                        left: contextMenu.x,
                        fontFamily: "Roboto"
                    }}
                    className={`
                        fixed z-50
                        w-44
                        rounded-xl
                        bg-[#272739]/80
                        backdrop-blur-sm
                        shadow-black
                        shadow-lg
                        p-1!
                        flex flex-col
                        duration-300
                        context-menu
                        
                        ${contextMenu.visible ? "open" : "closed"}
                    `}

                >
                    <button
                        onClick={() => handleAction("reply", contextMenu.messageData)}
                        className="flex items-center gap-4 px-2! py-1! text-white rounded-lg hover:bg-[#1F1F27]/70! cursor-pointer transition-colors"
                    >
                        <Reply size={18} className="text-[#707099]" />
                        <span>Reply</span>
                    </button>

                    <button
                        className="flex items-center gap-4 px-2! py-1! text-white rounded-lg hover:bg-[#1F1F27]/70! cursor-pointer transition-colors"
                    >
                        <Copy size={18} className="text-[#707099]"/>
                        <span>Copy Text</span>
                    </button>
                            
                    <button
                        className="flex items-center gap-4 px-2! py-1! text-white rounded-lg hover:bg-[#1F1F27]/70! cursor-pointer transition-colors"
                    >
                        <Pin size={18} className="text-[#707099]"/>
                        <span>Pin</span>
                    </button>
                        
                    <button
                        className="flex items-center gap-4 px-2! py-1! text-white rounded-lg hover:bg-[#1F1F27]/70! cursor-pointer transition-colors"
                    >
                        <Forward size={18} className="text-[#707099]"/>
                        <span>Forward</span>
                    </button>

                    <button
                        className="flex items-center gap-4 px-2! py-1! text-red-500! rounded-lg hover:bg-[#1F1F27]/70! cursor-pointer transition-colors"
                    >
                        <Trash size={18} className="text-red-500"/>
                        <span>Delete</span>
                    </button>
                </div>

        </div>
    );
}
