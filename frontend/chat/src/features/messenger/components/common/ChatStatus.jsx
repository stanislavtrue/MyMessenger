import { TypingIndicator } from "@/features/messenger/components/common/indicators/TypingIndicator";

export const ChatStatus = ({ status }) => {
    if (status === "typing") {
        return (
            <TypingIndicator 
                activeColor="#AA8DD2"
                textClassName="text-[#AA8DD2] text-sm!"
            />
        );
    }
    
    if (status === "online") {
        return <span className="text-[#AA8DD2] text-sm!">online</span>;
    }

    return <span className="text-[#52526B] text-sm!">last seen recently</span>;
};
