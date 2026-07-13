import { Check } from "lucide-react";

export const BubbleStatus = ({ status }) => {
    const isRead = status === "read";
    return (
        <div className="flex items-center relative w-2 h-3 shrink-0">
            <Check
                size={14}
                className={`absolute -left-1.5 -bottom-0.5 transition-colors duration-200
                    ${isRead ? "text-[#E2D9F3]" : "text-[#FFFFFF]/60"}
                `}
            />
            {isRead && (
                <Check
                    size={14}                           
                    className="absolute text-[#E2D9F3] left-0 -bottom-0.5"
                />
            )}
        </div>
    );
};
