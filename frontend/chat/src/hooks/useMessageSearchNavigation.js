import { useEffect } from "react"

export const useMessageSearchNavigation = (searchText, filteredSearchMessages, currentSearchIndex, triggerHighlight) => {
    useEffect(() => {
        if (!searchText || filteredSearchMessages.length === 0) return;
        
        const targetMessage = filteredSearchMessages[currentSearchIndex];

        if (targetMessage?.id) {
            const element = document.getElementById(`msg-${targetMessage.id}`);
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                triggerHighlight(targetMessage.id);
            }
        }
    }, [searchText, currentSearchIndex, filteredSearchMessages, triggerHighlight]);
};
