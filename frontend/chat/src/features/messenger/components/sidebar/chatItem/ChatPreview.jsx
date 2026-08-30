import { TypingIndicator } from "../../common/indicators/TypingIndicator";

export const ChatPreview = ({ user, isTyping, lastMessageText, isSelected }) => {
    return (
        <div className="flex flex-col min-w-0 flex-1 z-10">
            <span className="text-lg! truncate">
                {user.displayName}
            </span>

            {isTyping ? (
                <TypingIndicator
                    activeColor={isSelected ? "#FFFFFF" : "#959595"}
                    textClassName={`text-sm! ${isSelected ? "text-[#FFFFFF]" : "text-[#959595]"} `}
                />
            ) : (
                <span className={`truncate ${isSelected ? "text-[#FFFFFF]" : "text-[#959595]"} `}>
                    {lastMessageText}
                </span>
            )}
        </div>
    );
};
