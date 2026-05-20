import { MessageBubble } from "./MessageBubble";

export const MessageList = ({ messages }) => {

    return (
        <div className="
            flex flex-col 
            h-full py-10!
            overflow-y-auto
        ">

            <div className="mt-auto!">

                {messages.map((message) => (
                    <MessageBubble
                        key={message.id}
                        message={message}
                    />
                ))}

            </div>

        </div>
    );
}
