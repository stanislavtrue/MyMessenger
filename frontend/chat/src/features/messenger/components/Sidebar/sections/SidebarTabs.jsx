import { useHorizontalWheel } from "@/features/messenger/hooks/useHorizontalWheel";
import { useState } from "react";

export const SidebarTabs = () => {
    const [activeTab, setActiveTab] = useState("Chats");
    const tabs = ["Chats", "Channels", "Posts", "Media", "Links", "Files", "Music", "Voice"];

    const scrollRef = useHorizontalWheel(0.3);

    return (
        <div className="absolute top-3 left-4 right-4 z-20">
            <div
                ref={scrollRef}
                className="
                    flex gap-2 py-1! px-1! overflow-x-auto 
                    scrollbar-none bg-[#111111] rounded-full shrink-0
                    shadow-[0px_0px_5px_rgba(102,102,102,0.3)]
                "
            >
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <div
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                                px-4! py-2! font-medium! rounded-3xl cursor-pointer
                                hover:bg-[#282836]/50 transition-all duration-100 shrink-0
                                ${isActive ? "text-[#B06EE4] bg-[#B06EE4]/10" : "text-[#757993]"}
                            `}
                        >
                            {tab}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
