export const MessageBubble = ({ message }) => {
    return (
        <div className={`
                w-fit
                max-w-[70%]
                rounded-2xl
                py-1! px-4! mx-16! my-2!    
                break-words-word
                

                ${message.isOwnMessage
                    ? "ml-auto! bg-[#363646]"
                    : "mr-auto! bg-[#957AAA]"
                }
            `}
        >
            
            <div className="text-white text-lg!">
                {message.text}
            </div>

        </div>
    );
}
