import { MessageBubble } from "./MessageBubble";

export const MessageList = ({ messages }) => {

    return (
        <div className="
            flex flex-col 
            h-full py-10!
            overflow-y-auto
        ">

            <div className="mt-auto!">

                {messages.map((message, index) => {
                    const previousMessage = messages[index - 1];
                    const nextMessage = messages[index + 1];

                    const isFirstMessage = 
                        !previousMessage ||
                        previousMessage.isOwnMessage !== message.isOwnMessage;

                    const isLastMessage =
                        !nextMessage ||
                        nextMessage.isOwnMessage !== message.isOwnMessage;

                    return (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isFirstMessage={isFirstMessage}
                            isLastMessage={isLastMessage}
                        />
                    );
                })}

            </div>

        </div>
    );
}
