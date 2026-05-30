import { Heading } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";

export const ChatHeader = ({ chat, isMobile, onBack }) => {
    const renderStatus = () => {
        if (chat.status === "typing") {
            return (
                <div className="flex items-center"> 
                    <div 
                        className="scale-dot mr-1! h-[4px] w-[4px] rounded-full bg-[#AA8DD2]" 
                    />

                    <div 
                        style={{
                            animationDelay: "0.3s"
                        }}
                        className="scale-dot mr-1! h-[4px] w-[4px] rounded-full bg-[#AA8DD2]" 
                    />

                    <div 
                        style={{
                            animationDelay: "0.6s"
                        }}
                        className="scale-dot mr-2! h-[4px] w-[4px] rounded-full bg-[#AA8DD2]" 
                    />

                    <span className="text-[#AA8DD2] text-sm!">
                        typing
                    </span>

                </div>
            );
        }
        if (chat.status === "online") {
            return (
                <span className="text-[#AA8DD2] text-sm!">
                    online
                </span>
            );
        }
        return (
            <span className="text-[#52526B] text-sm!">
                last seen recently
            </span>
        )
    }

    return (
        <div className="
            w-full h-14
            bg-[#1F1F28] 
            flex items-center
            m-auto!
            select-none
        ">

            {isMobile && (
                <div 
                    onClick={onBack}
                    className="
                        ml-2!
                        flex items-center justify-center
                        h-10 w-10    
                        rounded-full
                        text-[#707099]
                        hover:bg-[#282836]
                        active:scale-90
                        active:bg-[#52526B]
                        transition-all duration-300
                        cursor-pointer
                        shrink-0
                    "
                >
                    <ArrowLeft size={22} />
                </div>
            )}

            <div className={`
                w-10 h-10 
                rounded-full 
                bg-[#5A4282] 
                flex items-center justify-center 
                text-white! text-xl! 
                shrink-0

                ${isMobile
                    ? "ml-2!"
                    : "ml-4!"
                }
            `}>
                {chat.name[0]}
            </div>

            <div className="flex flex-col ml-2! min-w-0">

                <span className="text-white text-lg! truncate">
                    {chat.name}
                </span>
                
                {renderStatus()}

            </div>
        </div>
    );
}
