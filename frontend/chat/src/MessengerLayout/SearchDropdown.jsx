import { useMessengerContext } from "../context/MessengerContext"
import { formatSidebarDate } from "../utils/formatSidebarDate";
import { highlightText } from "../utils/highlightText";

export const SearchDropdown = ({ chat }) => {
    const { filteredSearchMessages, searchText, currentSearchIndex, setCurrentSearchIndex } = useMessengerContext();

    if (!searchText.trim()) return null;

    return (
        <div className="
            absolute left-0 right-0 top-10
            bg-[#1F1F28] rounded-b-2xl
            shadow-[0px_10px_10px_rgba(0,0,0,0.5)]
            z-50 select-none
        ">
            <div className="h-px w-[97%] bg-[#282836] mx-auto! shrink-0" />

            <div className="
                max-h-95 overflow-y-auto
                scrollbar-thin scrollbar-thumb-[#282836] scrollbar-track-transparent
            ">
                <div className="flex flex-col py-1.5!">
                    {filteredSearchMessages.length === 0 ? (
                        <div className="px-4! py-3! text-center text-[#707099]">
                            No results found for "<span>{searchText}</span>".
                        </div>
                    ) : (
                        filteredSearchMessages.map((msg, index) => {
                            const isSelected = index === currentSearchIndex;
                            const senderName = msg.isOwnMessage ? "Main user" : chat.name;
                        
                            return (
                                <div
                                    key={msg.id}
                                    onClick={() => setCurrentSearchIndex(index)}
                                    className={`
                                        flex items-center gap-3
                                        px-3! py-1.5! mx-2!
                                        rounded-xl
                                        cursor-pointer transition-colors duration-0
                                        ${isSelected ? "bg-[#282836]" : "hover:bg-[#282836]"}    
                                    `}
                                >
                                    <div className={`
                                        size-11 rounded-full
                                        flex items-center justify-center
                                        text-white text-xl! shrink-0
                                        ${msg.isOwnMessage ? "bg-[#363646]" : "bg-[#5A4282]"}
                                    `}>
                                        {senderName[0]}
                                    </div>

                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-sm! truncate">
                                            {senderName}
                                        </span>

                                        <span className="text-white/50 text-sm! truncate mt-0.5!">
                                            {highlightText(msg.text, searchText)}
                                        </span>
                                    </div>
                                
                                    <span style={{fontFamily: "Roboto"}} className="text-xs! text-[#7D7DA2]/80 shrink-0 -mt-5!">
                                        {formatSidebarDate(msg.date, msg.time)}
                                    </span>
                                </div>
                            );
                        })
                    )}

                </div>
            </div>
        </div>
    );
};
