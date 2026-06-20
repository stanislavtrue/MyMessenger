import { ArrowLeft, EllipsisVertical, X} from "lucide-react";
import { SlMagnifier } from "react-icons/sl";
import { PinnedMessageBar } from "./PinnedMessageBar";
import { ChatStatus } from "@/features/messenger/components/ChatStatus";
import { ChatSearchBar } from "@/features/messenger/components/ChatSearchBar";
import { useMessengerContext } from "../context/MessengerContext";

export const ChatHeader = ({ chat, isMobile, onBack }) => {
    const { selectedChat, isChatSearchFocused, setIsChatSearchFocused } = useMessengerContext();
    
    return (
        <div className="
            relative w-full h-14 bg-[#1F1F28] 
            flex items-center m-auto! select-none
        ">
            {isMobile && (
                <div 
                    onClick={onBack}
                    className="
                        ml-2! h-10 w-10 
                        flex items-center justify-center
                        rounded-full text-[#707099]
                        hover:bg-[#282836] active:scale-90 active:bg-[#52526B]
                        transition-all duration-300 cursor-pointer shrink-0
                    "
                >
                    <ArrowLeft size={22} />
                </div>
            )}

            <div className={`
                w-10 h-10 
                rounded-full bg-[#5A4282] 
                flex items-center justify-center 
                text-white! text-xl! shrink-0

                ${isMobile ? "ml-2!" : "ml-6!"}
            `}>
                {chat.name[0]}
            </div>

            <div className="relative flex flex-1 items-center h-full min-w-0 ">

                <div className={`
                    absolute inset-0 flex items-center w-full h-full
                    transition-opacity duration-200 ease-in-out
                    ${isChatSearchFocused ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}
                `}>
                    <div className="flex flex-col ml-2! min-w-0 cursor-pointer">
                        <span className="text-white text-lg! truncate">{chat.name}</span>
                        <ChatStatus status={chat.status}/>        
                    </div>

                    <div className="flex items-center gap-1! ml-auto! mr-4!">
                        <PinnedMessageBar chat={selectedChat} />

                        <div 
                            onClick={() => setIsChatSearchFocused(true)}
                            className="
                                flex items-center justify-center
                                h-10 w-10 rounded-full
                                text-[#707099] hover:bg-[#282836]
                                active:scale-90 active:bg-[#52526B]
                                transition-all duration-200 cursor-pointer
                            "
                        >
                            <SlMagnifier size={18} strokeWidth={50} className=" "/>
                        </div>

                        <div className="
                            flex items-center justify-center
                            h-10 w-10 rounded-full
                            text-[#707099] hover:bg-[#282836]
                            active:scale-90 active:bg-[#52526B]
                            transition-all duration-200
                            cursor-pointer
                        ">
                            <EllipsisVertical size={20} strokeWidth={3} className=" "/>
                        </div>
                    </div>
                </div>

                <ChatSearchBar chat={chat} isVisible={isChatSearchFocused} />

            </div>
        </div>
    );
}
