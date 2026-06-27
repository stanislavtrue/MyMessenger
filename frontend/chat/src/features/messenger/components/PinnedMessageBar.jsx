import { useEffect, useRef, useState } from "react";
import { useMessengerContext } from "../context/MessengerContext"
import { useRipple } from "@/hooks/useRipple";
import { Pin, X } from "lucide-react";

export const PinnedMessageBar = ({ chat }) => {
    const { triggerHighlight } = useMessengerContext();
    const { ripples, createRipple } = useRipple();
    const [currentIndex, setCurrentIndex] = useState(0);

    const pinnedMessages = chat?.pinnedMessages || [];

    useEffect(() => {
        if (pinnedMessages.length > 0) {
            setCurrentIndex(pinnedMessages.length - 1);
        }
    }, [pinnedMessages.length, chat?.id]);

    if (pinnedMessages.length === 0) return null;

    const safeIndex = currentIndex >= pinnedMessages.length ? pinnedMessages.length - 1 : currentIndex;
    const currentPinned = pinnedMessages[safeIndex];

    const handleBarClick = (e) => {
        createRipple(e);

        if (e.target.closest('.unpin-btn')) return;

        const element = document.getElementById(`msg-${currentPinned.id}`);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            triggerHighlight(currentPinned.id);
        }

        setCurrentIndex((prevIndex) => (prevIndex === 0 ? pinnedMessages.length - 1 : prevIndex - 1));
    }

    const totalBars = Math.min(pinnedMessages.length, 5);
    const activeBarIndex = pinnedMessages.length <= 5 ? safeIndex : Math.floor((safeIndex / (pinnedMessages.length - 1)) * 4);

    return (
        <div 
            className="
                relative overflow-hidden
                flex items-center
                h-12 bg-[#111111]
                pl-1!
                rounded-3xl
            "
        >
            <div className="flex items-center justify-center size-10 rounded-full hover:bg-[#282836]/50 shrink-0">
                <Pin size={24} className="text-[#7F88C0]"/>
            </div>

            <div 
                onClick={handleBarClick}
                className="flex flex-1 items-center gap-2 hover:bg-[#6F26A1]/20 min-w-0 rounded-sm px-1! cursor-pointer select-none">
                {ripples.map((ripple) => (
                    <span
                        key={ripple.id}
                        className="animate-ripple"
                        style={{
                            top: ripple.y,
                            left: ripple.x,
                            width: ripple.size,
                            height: ripple.size,
                        }}
                    />
                ))}

                <div className="
                    flex flex-col gap-0.5
                    w-0.5 h-10
                    justify-center shrink-0
                ">
                    {Array.from({ length: totalBars }).map((_, idx) => {
                        const isActive = idx === activeBarIndex;
                        return (
                            <div
                                key={idx}
                                className={`
                                    rounded-full flex-1 transition-all duration-500 ease-in-out
                                    ${isActive
                                        ? "bg-[#7956E3] opacity-100"
                                        : "bg-[#3A3A4E] opacity-60"
                                    }    
                                `}
                            />
                        )
                    })}
                </div>

                <div className="flex flex-col justify-center overflow-hidden">
                    <div 
                        key={currentPinned.id}
                        className="flex flex-col justify-center w-full h-full"
                    >
                        <span className="text-sm! text-[#7956E3] font-semibold! leading-tight mb-0.5!">
                            Pinned Message #<span className="animate-slide-down">{pinnedMessages.length - safeIndex}</span>
                        </span>
                        <span className="animate-slide-down text-sm! truncate leading-tight">
                            {currentPinned.text}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center mr-1! justify-center size-10 rounded-full hover:bg-[#282836]/50 shrink-0">
                <X size={24} className="text-[#7F88C0]"/>
            </div>
        </div>
    )
}
