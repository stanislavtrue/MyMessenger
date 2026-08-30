import { useHorizontalWheel } from "@/features/messenger/hooks/sidebar/useHorizontalWheel";
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
                    scrollbar-none bg-[#222222] rounded-full shrink-0
                    shadow-[0px_0px_5px_rgba(0,0,0,0.5)]
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
                                transition-all duration-200 shrink-0
                                ${isActive ? "text-[#527AFF] bg-[#527AFF]/10" : "text-[#959595] hover:bg-[#282828]"}
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
