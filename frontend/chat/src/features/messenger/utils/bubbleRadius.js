export const getBubbleRadiusClass = (isOwnMessage, isFirstMessage, isLastMessage) => {
    if (!isFirstMessage && !isLastMessage) {
        return isOwnMessage ? "rounded-br-md rounded-tr-md" : "rounded-bl-md rounded-tl-md";
    }
    if (isFirstMessage && !isLastMessage) {
        return isOwnMessage ? "rounded-br-md" : "rounded-bl-md";
    }
    if (!isFirstMessage && isLastMessage) {
        return isOwnMessage ? "rounded-tr-md" : "rounded-tl-md";
    }
    
    return "";
};
