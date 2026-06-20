export const formatDividerDate = (dateString) => {
    if (!dateString) return "";

    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.getFullYear() < today.getFullYear()) {
        return messageDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).replace(/, (\d{4})/, ', $1');
    };

    const isSameDay = (d1, d2) => 
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    if (isSameDay(messageDate, today)) return "Today";
    if (isSameDay(messageDate, yesterday)) return "Yesterday";

    return messageDate.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}
