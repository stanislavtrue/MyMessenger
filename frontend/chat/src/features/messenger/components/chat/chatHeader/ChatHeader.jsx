import { useMessengerContext } from "@/features/messenger/context/MessengerContext";
import { ArrowLeft, EllipsisVertical, X} from "lucide-react";
import { SlMagnifier } from "react-icons/sl";
import { Avatar } from "../../common/Avatar";
import { ChatStatus } from "../../common/ChatStatus";
import { ChatSearchBar } from "./ChatSearchBar";

export const ChatHeader = ({ chat, isMobile, onBack }) => {
    const { isChatSearchFocused, setIsChatSearchFocused } = useMessengerContext();

    return (
        <div className="
            relative h-12 bg-[#111111] 
            flex items-center select-none
            rounded-3xl
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
                text-white! text-xl! shrink-0

                ${isMobile ? "ml-2!" : "ml-1!"}
            `}>
                <Avatar
                    size="size-10"
                    avatar={chat.user.avatar}
                    name={chat.user.displayName}
                />
            </div>

            <div className="relative flex flex-1 items-center h-full min-w-0 ">

                <div className={`
                    absolute inset-0 flex items-center w-full h-full
                    transition-opacity duration-200 ease-in-out
                    ${isChatSearchFocused ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}
                `}>
                    <div className="flex flex-col ml-3! min-w-0 cursor-pointer">
                        <span className="text-white font-medium! truncate">{chat.user.displayName}</span>
                        <ChatStatus isOnline={chat.user.isOnline} lastSeenAt={chat.user.lastSeenAt} />        
                    </div>

                    <div className="flex items-center ml-auto! gap-0.5 mr-1!">
                        <div 
                            onClick={() => setIsChatSearchFocused(true)}
                            className="
                                flex items-center justify-center
                                h-10 w-10 rounded-full
                                text-[#7F88C0] hover:bg-[#282836]/50
                                active:scale-90 active:bg-[#52526B]
                                transition-all duration-200 cursor-pointer
                            "
                        >
                            <SlMagnifier size={18} strokeWidth={50} className=" "/>
                        </div>

                        <div className="
                            flex items-center justify-center
                            h-10 w-10 rounded-full
                            text-[#7F88C0] hover:bg-[#282836]/50
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
