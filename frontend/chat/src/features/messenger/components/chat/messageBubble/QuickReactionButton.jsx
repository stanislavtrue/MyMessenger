export const QuickReactionButton = ({ isOwnMessage, onClick }) => {
    return (
        <div className={`
            absolute -bottom-2 z-30
            w-8 h-4 group cursor-pointer
            ${isOwnMessage ? "-left-1" : "-right-1"}
        `}>
            <div
                onClick={onClick}
                className={`
                    absolute -bottom-1 z-30
                    flex items-center justify-center
                    size-6 cursor-pointer
                    opacity-0 scale-75 pointer-events-none
                    group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
                    transition-all duration-200 ease-out
                    hover:scale-140! active:scale-90!
                    
                    ${isOwnMessage ? "-left-1" : "-right-1"}    
                `}
            >
                ❤️
            </div>
        </div>
    );
};
