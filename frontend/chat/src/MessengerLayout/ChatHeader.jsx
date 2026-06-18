import { ArrowLeft, Calendar, ChevronDown, ChevronUp, EllipsisVertical, X} from "lucide-react";
import { SlMagnifier } from "react-icons/sl";
import { useMessengerContext } from "../context/MessengerContext"
import { TypingIndicator } from "../components/indicators/TypingIndicator";
import { useEffect, useRef, useState } from "react";
import { SearchDropdown } from "./SearchDropdown";
import { PinnedMessageBar } from "./PinnedMessageBar";

export const ChatHeader = ({ chat, isMobile, onBack }) => {
    const { selectedChat, isChatSearchFocused, setIsChatSearchFocused, searchText, setSearchText, filteredSearchMessages, currentSearchIndex, setCurrentSearchIndex, closeChatSearch, handleNextSearch, handlePrevSearch } = useMessengerContext();
    const [isDropdownVisisble, setIsDropdownVisible] = useState(false);

    const inputRef = useRef(null);
    
    useEffect(() => {
        if (isChatSearchFocused) {
            setIsDropdownVisible(true);
            const timer = setTimeout(() => inputRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        } else {
            setIsDropdownVisible(false);
        }
    }, [isChatSearchFocused]);
    
    const renderStatus = () => {
        if (chat.status === "typing") {
            return (
                <TypingIndicator
                    activeColor="#AA8DD2"
                    textClassName="text-[#AA8DD2] text-sm!"
                />
            );
        }
        if (chat.status === "online") {
            return (
                <span className="text-[#AA8DD2] text-sm!">
                    online
                </span>
            );
        }
        return (
            <span className="text-[#52526B] text-sm!">
                last seen recently
            </span>
        )
    }

    return (
        <div className="
            relative
            w-full h-14
            bg-[#1F1F28] 
            flex items-center
            m-auto!
            select-none
        ">

            {isMobile && (
                <div 
                    onClick={onBack}
                    className="
                        ml-2!
                        flex items-center justify-center
                        h-10 w-10    
                        rounded-full
                        text-[#707099]
                        hover:bg-[#282836]
                        active:scale-90
                        active:bg-[#52526B]
                        transition-all duration-300
                        cursor-pointer
                        shrink-0
                    "
                >
                    <ArrowLeft size={22} />
                </div>
            )}

            <div className={`
                w-10 h-10 
                rounded-full 
                bg-[#5A4282] 
                flex items-center justify-center 
                text-white! text-xl! 
                shrink-0

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

                        <span className="text-white text-lg! truncate">
                            {chat.name}
                        </span>
                                
                        {renderStatus()}

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
                                transition-all duration-200
                                cursor-pointer
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

                <div className={`
                    absolute inset-0 flex items-center w-full h-full
                    transition-opacity duration-100 ease-in-out
                    ${isChatSearchFocused ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                `}>
                    <div className="flex flex-1 items-center gap-3">
                        <div className={`
                            relative
                            flex flex-1 items-center
                            ml-4! pl-4! z-50
                            min-w-0! w-full h-10 
                            group
                            bg-[#16161D]

                            focus-within:bg-[#1F1F28]
                            focus-within:shadow-[0px_0px_10px_rgba(0,0,0,0.5)]

                            transition-all duration-200 ease-in-out
                            
                            ${searchText.trim() && isDropdownVisisble
                                ? "rounded-t-3xl rounded-b-none"
                                : "rounded-4xl"
                            }
                        `}>

                            <SlMagnifier size={18} strokeWidth={35} className="shrink-0 transition-colors text-[#52526B] group-focus-within:text-[#8F5EB5]"/>

                            <input 
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                    setCurrentSearchIndex(0);
                                    setIsDropdownVisible(true);
                                }}
                                onFocus={() => setIsDropdownVisible(true)}
                                onBlur={() => {
                                    setTimeout(() => {
                                        setIsDropdownVisible(false);
                                    }, 100);
                                }}
                                ref={inputRef}
                                value={searchText}
                                type="text"
                                placeholder="Search"
                                border="none"
                                className="
                                    w-full
                                    pl-3!
                                    outline-none!
                                "
                            />
                                
                            {searchText && filteredSearchMessages.length > 0  && (
                                <div className="flex items-center shrink-0 p-0.5!"> 
                                    <div onClick={handleNextSearch} className="flex items-center justify-center size-7 rounded-full text-[#707099] hover:bg-[#282836] hover:text-white transition-colors">
                                        <ChevronUp size={26} />
                                    </div>

                                    <div onClick={handlePrevSearch} className="flex items-center justify-center size-7 rounded-full text-[#707099] hover:bg-[#282836] hover:text-white transition-colors">
                                        <ChevronDown size={26} />
                                    </div>
                                </div>
                            )}

                            <div 
                                onClick={closeChatSearch}
                                className="
                                    flex items-center justify-center 
                                    size-7 mx-3!
                                    hover:bg-[#282836] 
                                    rounded-full shrink-0
                                    cursor-pointer
                                ">
                                <X size={24} className="text-[#707099]"/>
                            </div>

                            {isDropdownVisisble && <SearchDropdown chat={chat} />}
                        </div>
                        

                        <div className="
                            flex items-center justify-center 
                            size-10 mr-4!
                            hover:bg-[#282836] 
                            rounded-full 
                            cursor-pointer
                        ">
                            <Calendar size={22} className="text-[#707099]" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
