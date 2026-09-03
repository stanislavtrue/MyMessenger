import { useLayoutEffect, useRef, useState } from "react";
import { ChatHeader } from "./chatHeader/ChatHeader";
import { PinnedMessageBar } from "./chatHeader/PinnedMessageBar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./chatFooter/MessageInput";

export const ChatArea = ({ selectedChat, onSendMessage, sidebarWidth, isMobile, onBack}) => {
    const headerRef = useRef(null);
    const footerRef = useRef(null);

    const [padding, setPadding] = useState({
        top: 0,
        bottom: 0,
    });

    useLayoutEffect(() => {
        if (!selectedChat) return;

        const update = () => {
            setPadding({
                top: (headerRef.current?.offsetHeight ?? 0),
                bottom: (footerRef.current?.offsetHeight ?? 0),
            });
        };

        update();

        const observer = new ResizeObserver(update);

        if (headerRef.current) observer.observe(headerRef.current);
        if (footerRef.current) observer.observe(footerRef.current);

        return () => observer.disconnect();
    }, [selectedChat, selectedChat?.pinnedMessages?.length]);

    if(!selectedChat) {
        return (
            <div className="flex-1 h-screen flex justify-center items-center" />
        );
    }

    return (
        <div className="relative flex-1 h-screen flex flex-col min-w-0">
            <div className="relative flex-1 flex flex-col w-full h-full overflow-hidden">
                <div className="absolute top-0 inset-x-0 z-30 pointer-events-none">
                    <div className="max-w-180 mx-auto! w-full">
                        <div ref={headerRef} className="bg-linear-to-t from-[#09090b]/0 to-[#09090b] pointer-events-auto">
                            <div className="pt-6! mx-auto! transition-all duration-75 ease-out">
                                <ChatHeader chat={selectedChat} isMobile={isMobile} onBack={onBack} />
                            </div>
                            <div className="max-w-180 mx-auto! mt-2! transition-all duration-75 ease-out">
                                <PinnedMessageBar chat={selectedChat} />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#282836] scrollbar-track-transparent">
                    <div style={{ paddingTop: padding.top, paddingBottom: padding.bottom }} className="w-full min-h-full flex flex-col transition-all duration-75 ease-out">
                        <MessageList messages={selectedChat.messages}/>
                    </div>
                </div>
                
                <div className="absolute bottom-0 inset-x-0 z-30 pointer-events-none">
                    <div ref={footerRef} className="max-w-180 mx-auto! transition-all duration-75 ease-out">
                        <div className="pb-6! bg-linear-to-b from-[#09090b]/0 to-[#09090b] rounded-3xl pointer-events-auto">
                            <MessageInput onSendMessage={onSendMessage}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
