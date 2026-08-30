import { MESSAGE_STATUS } from "@/features/messenger/constants/messageBubbleStatus";
import { Check } from "lucide-react";

export const BubbleStatus = ({ status }) => {
    const isRead = status === MESSAGE_STATUS.READ;
    return (
        <div className="flex items-center relative w-2 h-3 shrink-0 ml-1!">
            <Check
                size={14}
                className={`absolute -left-1.5 -bottom-0.5 transition-colors duration-500
                    ${isRead ? "text-[#ffffff]" : "text-[#FFFFFF]/60"}
                `}
            />
            {isRead && (
                <Check
                    size={14}                           
                    className="absolute text-[#ffffff] left-0 -bottom-0.5 animate-read-status"
                />
            )}
        </div>
    );
};
