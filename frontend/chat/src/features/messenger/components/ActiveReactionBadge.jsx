export const ActiveReactionBadge = ({ reaction, isOwnMessage, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className={`
                z-10 w-fit gap-2 my-1!
                flex justify-center items-center
                px-1.5! py-0.5! rounded-full
                text-md! select-none animate-scale-up 
                cursor-pointer
                ${isOwnMessage 
                    ? "bg-[#CFA4F2]/80 hover:bg-[#CFA4F2]" 
                    : "bg-white/80 hover:bg-white"
                }   
            `}
        >
            <span>{reaction}</span>
            <div className="size-5 rounded-full bg-white/60"/>
        </div>
    );
}
