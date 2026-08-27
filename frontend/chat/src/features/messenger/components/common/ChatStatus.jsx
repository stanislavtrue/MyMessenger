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
                activeColor="#AA8DD2"
                textClassName="text-[#AA8DD2] text-sm!"
            />
        );
    }
    
    if (isOnline) {
        return <span className="text-[#AA8DD2] text-sm!">online</span>;
    }

    return <span className="text-[#52526B] text-sm!">{statusText}</span>;
};
