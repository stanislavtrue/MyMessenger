const POPULAR_REACTIONS = ["👏", "❤️", "👍", "👎", "🔥", "🥰", "😁"]

export const MessageReactionPicker = ({ onReactionSelect }) => {
    return (
        <div className="
            flex items-center gap-1.5 bg-[#1C1C1C] rounded-2xl
            shadow-[0px_0px_10px_2px_rgba(0,0,0,0.5)] animate-scale-up mb-1! px-2!
            w-fit select-none
        ">
            {POPULAR_REACTIONS.map((emoji, index) => (
                <div
                    key={emoji}
                    onClick={() => onReactionSelect(emoji)}
                    style={{ "--i": index }}
                    className="
                        text-[24px]! cursor-pointer transition-transform duration-0 ease-out
                        hover:scale-120 active:scale-95 rounded-lg emoji-pop 
                    "
                >
                    {emoji}
                </div>
            ))}
        </div>
    );
};
