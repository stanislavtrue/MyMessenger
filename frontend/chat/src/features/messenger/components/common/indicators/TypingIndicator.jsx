export const TypingIndicator = ({
    text = "typing",
    activeColor = "#959595",
    textClassName = "",
}) => {
    return (
        <div className="flex items-center">
            
            <div 
                className="scale-dot mr-1! h-1 w-1 rounded-full"
                style={{ backgroundColor: activeColor }}
            />

            <div 
                className="scale-dot mr-1! h-1 w-1 rounded-full"
                style={{
                    backgroundColor: activeColor,
                    animationDelay: "0.3s"
                }}
            />

            <div 
                className="scale-dot mr-2! h-1 w-1 rounded-full"
                style={{
                    backgroundColor: activeColor,
                    animationDelay: "0.6s"
                }}
            />

            <span className={textClassName}>
                {text}
            </span>

        </div>
    );
};
