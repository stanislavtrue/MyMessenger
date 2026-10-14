import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChatHeader } from "./chatHeader/ChatHeader";
import { PinnedMessageBar } from "./chatHeader/PinnedMessageBar";
import { MessageList } from "./MessageList";
import { MessageInput } from "./chatFooter/MessageInput";
import { frame } from "motion";
import { formatDividerDate } from "../../utils/formatDividerDate";

export const ChatArea = ({ selectedChat, onSendMessage, isMobile, onBack, isLoadingMessages}) => {
    const [readTrackingChatId, setReadTrackingChatId] = useState(null);
    const [currentVisibleDate, setCurrentVisibleDate] = useState("");
    const [isDividerVisible, setIsDividerVisisble] = useState(false);

    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const messagesScrollRef = useRef(null);
    const scrollStopTimerRef = useRef(null);

    const [padding, setPadding] = useState({
        top: 0,
        bottom: 0,
    });

    const updateVisibleDate = useCallback(() => {
        const container = messagesScrollRef.current;

        if (!container)
            return;

        const containerRect = container.getBoundingClientRect();
        const headerHeight = headerRef.current?.offsetHeight ?? 0;

        const visibleTop = containerRect.top + headerHeight + 8;

        const messageElement = container.querySelectorAll("[data-message-date]");

        let visibleDate = "";

        for (const element of messageElement) {
            const rect = element.getBoundingClientRect();

            if (rect.bottom > visibleTop) {
                visibleDate = element.dataset.messageDate || "";
                break;
            }
        }

        setCurrentVisibleDate((previous) => 
            previous === visibleDate ? previous : visibleDate
        );
    }, []);

    useEffect(() => {
        const container = messagesScrollRef.current;

        if (!container)
            return;

        let frameId = 0;

        const handleScroll = () => {
            setIsDividerVisisble(true);

            if (scrollStopTimerRef.current)
                clearTimeout(scrollStopTimerRef.current);

            scrollStopTimerRef.current = setTimeout(() => {
                setIsDividerVisisble(false);
            }, 1000);

            if (frameId) 
                cancelAnimationFrame(frameId);

            frameId = requestAnimationFrame(() => {
                updateVisibleDate();
                frameId = 0;
            });
        };

        container.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        updateVisibleDate();

        return () => {
            container.removeEventListener("scroll", handleScroll);

            if (frameId)
                cancelAnimationFrame(frameId);

            if (scrollStopTimerRef.current)
                clearTimeout(scrollStopTimerRef.current);
        };
    }, [selectedChat?.id, updateVisibleDate]);

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

    useLayoutEffect(() => {
        if (!selectedChat || isLoadingMessages) 
            return;

        const container = messagesScrollRef.current;
        if (!container)
            return;

        container.scrollTop = container.scrollHeight;

        setReadTrackingChatId(selectedChat.id);

        requestAnimationFrame(() => {
            updateVisibleDate();
        });
    }, [selectedChat?.id, isLoadingMessages]);

    useLayoutEffect(() => {
        setCurrentVisibleDate("");
    }, [selectedChat?.id]);

    if(!selectedChat) {
        return (
            <div className="flex-1 h-screen flex justify-center items-center" />
        );
    }

    return (
        <div className="relative flex-1 h-screen flex flex-col min-w-0">
            <div className="relative flex-1 flex flex-col w-full h-full overflow-hidden">
                {!isLoadingMessages && currentVisibleDate && (
                    <div
                        className={`
                            absolute z-20 flex justify-center pointer-events-none transition-opacity duration-400
                            ${isDividerVisible ? "opacity-100" : "opacity-0"}
                        `}
                        style={{
                            top: padding.top + 8,
                            left: 0,
                            right: 0,
                        }}
                    >
                        <div className="px-3! py-1! flex justify-center bg-[#00C8FF]/15 text-sm! text-white font-semibold! rounded-2xl shadow-sm">
                            {formatDividerDate(currentVisibleDate)}
                        </div>
                    </div>
                )}
                <div className="absolute top-0 inset-x-0 z-30 pointer-events-none">
                    <div className="max-w-180 mx-auto! w-full">
                        <div 
                            ref={headerRef} 
                            className="bg-linear-to-t from-[#111111]/0 to-[#111111] pointer-events-auto"
                        >
                            <div className="pt-6! mx-auto! transition-all duration-75 ease-out">
                                <ChatHeader chat={selectedChat} isMobile={isMobile} onBack={onBack} />
                            </div>
                            <div className="max-w-180 mx-auto! mt-2! transition-all duration-75 ease-out">
                                <PinnedMessageBar chat={selectedChat} />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div 
                    ref={messagesScrollRef}               
                    className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#282836] scrollbar-track-transparent"
                >
                    <div 
                        style={{ 
                            paddingTop: padding.top, 
                            paddingBottom: padding.bottom 
                        }} 
                        className="w-full min-h-full flex flex-col "
                    >
                        {!isLoadingMessages && selectedChat && (
                            <MessageList 
                                messages={selectedChat.messages} 
                                chat={selectedChat} 
                                scrollContainerRef={messagesScrollRef} 
                                isReadTrackingEnabled={readTrackingChatId === selectedChat.id && !isLoadingMessages}
                            />
                        )}
                    </div>
                </div>
                
                <div className="absolute bottom-0 inset-x-0 z-30 pointer-events-none">
                    <div 
                        ref={footerRef} 
                        className="max-w-180 mx-auto! transition-all duration-75 ease-out"
                    >
                        <div className="pb-6! bg-linear-to-b from-[#111111]/0 to-[#111111] rounded-3xl pointer-events-auto">
                            <MessageInput onSendMessage={onSendMessage}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
