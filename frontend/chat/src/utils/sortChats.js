export const sortChats = (chats) => {
    return [...chats].sort((a, b) => {
        const lastMsgA = a.messages && a.messages.length > 0 ? a.messages[a.messages.length - 1] : null;
        const lastMsgB = b.messages && b.messages.length > 0 ? b.messages[b.messages.length - 1] : null;

        const dateA = lastMsgA?.date || "1970-01-01";
        const dateB = lastMsgB?.date || "1970-01-01";

        const timeA = lastMsgA?.time || "00:00";
        const timeB = lastMsgB?.time || "00:00";

        if (dateA !== dateB) {
            return dateB.localeCompare(dateA);
        }

        return timeB.localeCompare(timeA);
    })
}
