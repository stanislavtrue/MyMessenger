import { formatDividerDate } from "../utils/formatDividerDate";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";

export const MessageList = ({ messages }) => {

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    return (
        <div className="
            flex flex-col 
            h-full py-10!
        ">

            <div className="mt-auto!">

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

                            <MessageBubble
                                key={message.id}
                                message={message}
                                isFirstMessage={isFirstMessage}
                                isLastMessage={isLastMessage}
                            />

                        </div>
                    );
                })}
            
                <div ref={bottomRef} />

            </div>

        </div>
    );
}
