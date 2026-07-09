import { useRipple } from "@/hooks/useRipple";
import { useMessengerContext } from "../context/MessengerContext"

export const useReplyScroll = (message) => {
    const { triggerHighlight } = useMessengerContext();
    const { ripples, createRipple } = useRipple();

    const handleReplyClick = (e) => {
        if (!message.replyTo.id) return;

        createRipple(e);

        const element = document.getElementById(`msg-${message.replyTo.id}`);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            triggerHighlight(message.replyTo.id);
        }
    };

    return { ripples, handleReplyClick };
};
