export const formatSidebarDate = (dateString, timeString) => {
    if (!dateString) return "";

    const messageDate = new Date(dateString);
    const today = new Date();

    if (messageDate.getFullYear() < today.getFullYear()) {
        return messageDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).replace(/, (\d{4})/, ', $1');
    }

    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMessageDate = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());

    const diffTime = startOfToday - startOfMessageDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return timeString ? timeString.slice(0, 5) : "";
    }

    if (diffDays > 0 && diffDays < 7) {
        return messageDate.toLocaleDateString("en-US", { weekday: "short" });
    }

    return messageDate.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}
