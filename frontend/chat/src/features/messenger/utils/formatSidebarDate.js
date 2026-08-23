export const formatSidebarDate = (dateString) => {
    if (!dateString) return "";

    const messageDate = new Date(dateString);

    if (isNaN(messageDate.getTime())) return "";

    const today = new Date();

    if (messageDate.toDateString() === today.toDateString()) {
        return messageDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMessageDate = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());

    const diffTime = startOfToday - startOfMessageDate;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0 && diffDays < 7) {
        return messageDate.toLocaleDateString("en-US", { weekday: "short" });
    }

    if (messageDate.getFullYear() < today.getFullYear()) {
        return messageDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    return messageDate.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}
