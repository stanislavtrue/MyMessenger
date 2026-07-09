export const BubbleTail = ({ isOwnMessage }) => {
    const sideClass = isOwnMessage ? "-right" : "-left";
    const bgClass = isOwnMessage ? "bg-[#7D55B5]" : "bg-[#28292B]"

    return (
        <>
            <div className={`
                absolute bottom-0 w-2 h-2 opacity-85 
                shadow-[3px_3px_4px_rgba(0,0,0,0.5)]
                ${sideClass}-2 rounded-full ${bgClass}
            `}/>
            <div className={`
                absolute bottom-0 w-1 h-1 opacity-70 
                shadow-[3px_3px_2px_rgba(0,0,0,0.5)] 
                ${sideClass}-3.5 rounded-full ${bgClass}
            `}/>
        </>
    );
};
