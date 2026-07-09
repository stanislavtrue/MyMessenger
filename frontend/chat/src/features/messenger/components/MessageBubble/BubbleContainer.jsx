import { getBubbleRadiusClass } from "../../utils/bubbleRadius"
import { BubbleTail } from "./BubbleTail";

export const BubbleContainer = ({ children, isOwnMessage, isFirstMessage, isLastMessage }) => {
    const radiusClass = getBubbleRadiusClass(isOwnMessage, isFirstMessage, isLastMessage);

    return (
        <div className={`
                relative w-fit max-w-[75%]
                rounded-2xl py-1! px-3!
                shadow-[2px_8px_12px_rgba(0,0,0,0.8)]
                ${radiusClass}
                ${isOwnMessage
                    ? "ml-auto! mr-4! bg-[#7D55B5]"
                    : "mr-auto! ml-4! bg-[#28292B]"
                }
            `}
        >
            {children}
            {isLastMessage && <BubbleTail isOwnMessage={isOwnMessage} />}
        </div>
    );
};
