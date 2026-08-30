import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronDown, ChevronUp, X } from "lucide-react";
import { SlMagnifier } from "react-icons/sl";
import { useMessengerContext } from "@/features/messenger/context/MessengerContext";
import { SearchDropdown } from "./SearchDropdown";

export const ChatSearchBar = ({ chat, isVisible }) => {
    const {
        chatSearchText, setChatSearchText, filteredSearchMessages,
        setCurrentSearchIndex, closeChatSearch, handleNextSearch, handlePrevSearch
    } = useMessengerContext();

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isVisible) {
            setIsDropdownVisible(true);
            const timer = setTimeout(() => inputRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        } else {
            setIsDropdownVisible(false);
        }
    }, [isVisible]);

    return (
        <div className={`
            absolute inset-0 flex items-center w-full h-full
            transition-opacity duration-100 ease-in-out
            ${isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}>
            <div className="flex flex-1 items-center gap-3">
                <div className={`
                    relative flex flex-1 items-center
                    ml-4! pl-4! z-50 min-w-0! w-full h-10 
                    group bg-[#111111] focus-within:bg-[#1C1C1C]
                    focus-within:shadow-[0px_0px_10px_rgba(0,0,0,0.5)]

                    transition-all duration-200 ease-in-out
                    
                    ${chatSearchText.trim() && isDropdownVisible
                        ? "rounded-t-3xl rounded-b-none"
                        : "rounded-4xl"
                    }
                `}>

                    <SlMagnifier size={18} strokeWidth={35} className="shrink-0 transition-colors text-[#959595]/70 group-focus-within:text-[#527AFF]"/>

                    <input 
                        ref={inputRef}
                        value={chatSearchText}
                        onChange={(e) => {
                            setChatSearchText(e.target.value);
                            setCurrentSearchIndex(0);
                            setIsDropdownVisible(true);
                        }}
                        onFocus={() => setIsDropdownVisible(true)}
                        onBlur={() => {
                            setTimeout(() => setIsDropdownVisible(false), 100);
                        }}
                        type="text"
                        placeholder="Search"
                        className="w-full pl-3! outline-none! placeholder:text-[#959595]/70!"
                    />
                        
                    {chatSearchText && filteredSearchMessages.length > 0  && (
                        <div className="flex items-center shrink-0 p-0.5!"> 
                            <div onClick={handleNextSearch} className="flex items-center justify-center size-7 rounded-full text-[#959595]/70 hover:bg-[#212121] hover:text-white transition-colors">
                                <ChevronUp size={26} />
                            </div>

                            <div onClick={handlePrevSearch} className="flex items-center justify-center size-7 rounded-full text-[#959595]/70 hover:bg-[#212121] hover:text-white transition-colors">
                                <ChevronDown size={26} />
                            </div>
                        </div>
                    )}

                    <div 
                        onClick={closeChatSearch}
                        className="
                            flex items-center justify-center size-7 mx-3!
                            hover:bg-[#212121] rounded-full shrink-0
                            cursor-pointer
                        ">
                        <X size={24} className="text-[#959595]/70"/>
                    </div>

                    {isDropdownVisible && <SearchDropdown chat={chat} />}
                </div>
                

                <div className="
                    flex items-center justify-center size-10 mr-1!
                    hover:bg-[#212121] rounded-full cursor-pointer
                    transition-all active:scale-90 active:bg-[#2E2E2E] duration-200
                ">
                    <Calendar size={22} className="text-[#959595]" />
                </div>
            </div>
        </div>
    );
}
