import { formatDividerDate } from "../utils/formatDividerDate";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { useContextMenu } from "../hooks/useContextMenu";
import { Copy, Pin, Trash } from "lucide-react";
import { SlActionRedo, SlActionUndo } from "react-icons/sl"
import { useMessengerContext } from "../context/MessengerContext";
import { ContextMenuWrapper } from "./ContextMenuWrapper";

export const MessageList = ({ messages, contentStyle }) => {
    const { contextMenu, setContextMenu, openReply, showToast, selectedChatId, handleDeleteMessage } = useMessengerContext();
    const { showMenu, closeMenu } = useContextMenu(contextMenu, setContextMenu);

    const handleReplyClick = () => {
        openReply(contextMenu.messageData);
        document.getElementById("message-input")?.focus();
        closeMenu();
    }

    const handleQuickReply = (message) => {
        openReply(message);
        document.getElementById("message-input")?.focus();
    }

    const handleDeleteClick = () => {
        if (!contextMenu.messageData || !selectedChatId) return;

        handleDeleteMessage(selectedChatId, contextMenu.messageData.id);

        closeMenu();
    }

    const handleCopyClick = async () => {
        if (!contextMenu.messageData || !contextMenu.messageData.text) return;

        try {
            await navigator.clipboard.writeText(contextMenu.messageData.text);
            showToast("Copied to Clipboard")
            console.log("Text copied to clipboard");
        } catch (err) {
            console.error("Text didn't copy to clipboard", err);
        } finally {
            closeMenu();
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
            {contextMenu.visible && contextMenu.type === "message" && (
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
                        
                    const isTargetMessage = contextMenu.visible && contextMenu.type === "message" && contextMenu.messageData?.id === message.id;

                    let spacingClass = "mb-1.5!";
                    if (isLastMessage) {
                        spacingClass = "mb-3!";
                    }

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
                                onDoubleClick={() => handleQuickReply(message)} 
                                className={`w-full flex items-center message-row-highlight ${spacingClass} ${isTargetMessage ? "active" : ""}`}
                            >

                                <div style={contentStyle} className="mx-auto!">

                                    <div 
                                        onContextMenu={(e) => showMenu(e, message, "message")}
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
                            </div>
                        </div>
                    );
                })}
            
                <div ref={bottomRef} />

            </div>

                <ContextMenuWrapper type="message">
                    <button
                        onClick={handleReplyClick}
                        className="flex items-center gap-5 px-3! py-1.5! text-sm! font-semibold! text-white rounded-lg hover:bg-[#131319]/80! cursor-pointer transition-colors duration-0"
                    >
                        <SlActionUndo size={18} strokeWidth={40} className="text-[#8888BA]" />
                        <span>Reply</span>
                    </button>

                    <button
                        onClick={handleCopyClick}
                        className="flex items-center gap-5 px-3! py-1.5! text-sm! font-semibold! text-white rounded-lg hover:bg-[#131319]/80! cursor-pointer transition-colors duration-0"
                    >
                        <Copy size={18} strokeWidth={2.5} className="text-[#8888BA]"/>
                        <span>Copy Text</span>
                    </button>
                            
                    <button
                        className="flex items-center gap-5 px-3! py-1.5! text-sm! font-semibold! text-white rounded-lg hover:bg-[#131319]/80! cursor-pointer transition-colors duration-0"
                    >
                        <Pin size={18} strokeWidth={2.5} className="text-[#8888BA]"/>
                        <span>Pin</span>
                    </button>
                        
                    <button
                        className="flex items-center gap-5 px-3! py-1.5! text-sm! font-semibold! text-white rounded-lg hover:bg-[#131319]/80! cursor-pointer transition-colors duration-0"
                    >
                        <SlActionRedo size={18} strokeWidth={40} className="text-[#8888BA]"/>
                        <span>Forward</span>
                    </button>

                    <button
                        onClick={handleDeleteClick}
                        className="flex items-center gap-5 px-3! py-1.5! text-sm! font-semibold! text-red-500! rounded-lg hover:bg-[#131319]/80! hover:text-white! cursor-pointer transition-colors duration-0"
                    >
                        <Trash size={18} strokeWidth={2.5} />
                        <span>Delete</span>
                    </button>
                </ContextMenuWrapper>

        </div>
    );
}
