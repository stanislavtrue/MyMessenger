export const MessageInput = () => {
    return (
        <div className="
            w-[90%] h-14
            bg-[#1F1F28]    
            rounded-4xl
            !mb-4 !mx-auto
            !px-8
            flex items-center
            focus-within:ring-2
            focus-within:ring-[#957AAA]
            transition-all duration-300
        ">
            <input
                className="
                    w-full
                    h-full
                    bg-transparent
                    !outline-none
                    text-xl
                "
                type="text"
                placeholder="Write a message..."
                color="white"
                border="none"
                _placeholder={{
                    color: "#52526B"
                }}
            />

        </div>
    );
}
