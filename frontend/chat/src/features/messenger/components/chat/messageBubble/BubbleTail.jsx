export const BubbleTail = ({ isOwnMessage }) => {
    const positionClassLarge = isOwnMessage ? "-right-2" : "-left-2";
    const positionClassSmall = isOwnMessage ? "-right-3.5" : "-left-3.5";
    const bgClass = isOwnMessage ? "bg-[#7D55B5]" : "bg-[#28292B]";

    return (
        <>
            <div className={`
                absolute bottom-0 w-2 h-2 opacity-85 
                shadow-[3px_3px_4px_rgba(0,0,0,0.5)]
                ${positionClassLarge} rounded-full ${bgClass}
            `}/>
            <div className={`
                absolute bottom-0 w-1 h-1 opacity-70 
                shadow-[3px_3px_2px_rgba(0,0,0,0.5)] 
                ${positionClassSmall} rounded-full ${bgClass}
            `}/>
        </>
    );
};
