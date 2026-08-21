export const formatLastSeen = (lastSeenAt) => {
    const now = new Date();
    const lastSeen = new Date(lastSeenAt);
    const diffInSeconds = Math.floor((now - lastSeen) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInSeconds < 60) 
        return "last seen just now";

    if (diffInMinutes < 60)
        return `last seen ${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;

    const isToday = now.toDateString() === lastSeen.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = yesterday.toDateString() === lastSeen.toDateString();

    const timeString = lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) 
        return `last seen at ${timeString}`;

    if (isYesterday)
        return `last seen yesterday at ${timeString}`;

    return `last seen ${lastSeen.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${timeString}`;
}
