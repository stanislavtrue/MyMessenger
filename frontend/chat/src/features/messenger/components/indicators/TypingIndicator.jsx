export const TypingIndicator = ({
    text = "typing",
    activeColor = "#AA8DD2",
    textClassName = "",
}) => {
    return (
        <div className="flex items-center">
            
            <div 
                className="scale-dot mr-1! h-[4px] w-[4px] rounded-full"
                style={{ backgroundColor: activeColor }}
            />

            <div 
                className="scale-dot mr-1! h-[4px] w-[4px] rounded-full"
                style={{
                    backgroundColor: activeColor,
                    animationDelay: "0.3s"
                }}
            />

            <div 
                className="scale-dot mr-2! h-[4px] w-[4px] rounded-full"
                style={{
                    backgroundColor: activeColor,
                    animationDelay: "0.6s"
                }}
            />

            <span className={textClassName}>
                {text}
            </span>

        </div>
    )
}
