import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { PinnedMessageBar } from "./PinnedMessageBar";

export const ChatArea = ({ selectedChat, onSendMessage, sidebarWidth, isMobile, onBack}) => {

    if(!selectedChat) {
        return (
            <div className="flex-1 h-screen flex justify-center items-center" />
        );
    }

    return (
        <div className="relative flex-1 h-screen flex flex-col p-4! pl-1.5! min-w-0">
            <div className="
                relative flex-1 flex flex-col w-full h-full
                bg-[#1F1F28]/60 rounded-3xl
                border! border-[#808080]! overflow-hidden
            ">
                <div className="absolute top-0 inset-x-0 z-30 pointer-events-none">
                    <div className="max-w-180 mx-auto! w-full">
                        <div className="bg-[#1F1F28]/10 backdrop-blur-xs pointer-events-auto">
                            <div className="pt-3! mx-auto! transition-all duration-75 ease-out">
                                <ChatHeader chat={selectedChat} isMobile={isMobile} onBack={onBack} />
                            </div>
                            <div className="max-w-180 mx-auto! mt-2! transition-all duration-75 ease-out">
                                <PinnedMessageBar chat={selectedChat} />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="w-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#282836] scrollbar-track-transparent">
                    <div className="w-full transition-all duration-75 ease-out pt-25! pb-12!">
                        <MessageList messages={selectedChat.messages}/>
                    </div>
                </div>
                
                <div className="absolute bottom-0 inset-x-0 z-30 pointer-events-none">
                    <div className="max-w-180 mx-auto! transition-all duration-75 ease-out">
                        <div className="pb-3! bg-linear-to-b from-[#1F1F28]/0 to-[#1F1F28]/30 rounded-3xl backdrop-blur-xs pointer-events-auto">
                            <MessageInput onSendMessage={onSendMessage}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
