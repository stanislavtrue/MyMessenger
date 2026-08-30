import { TypingIndicator } from "@/features/messenger/components/common/indicators/TypingIndicator";
import { formatLastSeen } from "@/utils/formatLastSeen";
import { useEffect, useState } from "react";

export const ChatStatus = ({ isOnline, isTyping, lastSeenAt }) => {
    const [statusText, setStatusText] = useState(() => formatLastSeen(lastSeenAt));

    useEffect(() => {
        setStatusText(formatLastSeen(lastSeenAt));

        if (isOnline || !lastSeenAt) return;

        const interval = setInterval(() => {
            setStatusText(formatLastSeen(lastSeenAt));
        }, 6000);

        return () => clearInterval(interval);
    }, [isOnline, lastSeenAt]);

    if (isTyping) {
        return (
            <TypingIndicator 
                activeColor="#7B9AFF"
                textClassName="text-[#7B9AFF] text-sm!"
            />
        );
    }
    
    if (isOnline) {
        return <span className="text-[#7B9AFF] text-sm!">online</span>;
    }

    return <span className="text-[#959595] text-sm!">{statusText}</span>;
};
