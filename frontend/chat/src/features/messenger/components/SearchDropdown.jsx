import { useMessengerContext } from "../context/MessengerContext"
import { formatSidebarDate } from "../utils/formatSidebarDate";
import { highlightText } from "../utils/highlightText";
import { Avatar } from "./Avatar";

export const SearchDropdown = ({ chat }) => {
    const { filteredSearchMessages, searchText, currentSearchIndex, setCurrentSearchIndex } = useMessengerContext();

    if (!searchText.trim()) return null;

    return (
        <div className="
            absolute left-0 right-0 top-10
            bg-[#111111] rounded-b-2xl
            shadow-[0px_10px_10px_rgba(0,0,0,0.5)]
            z-50 select-none
        ">
            <div className="h-px w-[97%] bg-[#282836] mx-auto! shrink-0" />

            <div className="
                max-h-60 overflow-y-auto
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
                                        rounded-3xl
                                        cursor-pointer transition-colors duration-0
                                        ${isSelected ? "bg-[#5835AA]" : "hover:bg-[#282836]/50"}    
                                    `}
                                >
                                    <div className={`
                                        text-white text-xl! shrink-0
                                    `}>
                                        <Avatar 
                                            size="size-11"
                                            avatar={chat.avatar}
                                            name={chat.name}
                                        />
                                    </div>

                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-sm! font-medium! truncate">
                                            {senderName}
                                        </span>

                                        <span className="text-white/50 text-sm! truncate mt-0.5!">
                                            {highlightText(msg.text, searchText)}
                                        </span>
                                    </div>
                                
                                    <span style={{fontFamily: "Roboto"}} className="text-xs! text-white/50 shrink-0 -mt-5!">
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
