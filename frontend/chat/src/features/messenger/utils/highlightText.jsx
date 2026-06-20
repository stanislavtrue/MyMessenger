export const highlightText = (text, searchText) => {
    if (!searchText || !searchText.trim()) return text;

    const flags = searchText.trim().length === 1 ? "i" : "gi";
    const regex = new RegExp(`(${searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, flags);
    const parts = text.split(regex);

    let hasHighlightedFirst = false;

    return parts.map((part, i) => {
        const isMatch = part.toLowerCase() === searchText.toLowerCase();

        if (isMatch && (searchText.trim().length > 1 || !hasHighlightedFirst)) {
            if (searchText.trim().length === 1) {
                hasHighlightedFirst = true;
            }

            return (
                <mark
                    key={i}
                    className="rounded-sm px-0.5! transition-colors duration-200 bg-[#CBB4EB] text-black!"
                >
                    {part}
                </mark>
            );
        }

        return part;
    });
};
