import { BsFillPinAngleFill } from "react-icons/bs";
import { BubbleStatus } from "./BubbleStatus";

export const BubbleFooter = ({ isPinned, time, isOwnMessage, status }) => {
    return (
        <div className="flex items-center gap-1.5 ml-auto! shrink-0 select-none">
            {isPinned && (
                <BsFillPinAngleFill size={12} className="text-white/60 shrink-0" />
            )}
            
            <span className="text-xs! opacity-50 leading-none shrink-0">
                {time?.slice(0, 5)}
            </span>

            {isOwnMessage && <BubbleStatus status={status} />}
        </div>
    );
};
