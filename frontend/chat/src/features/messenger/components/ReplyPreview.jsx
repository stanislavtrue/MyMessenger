import { X } from "lucide-react";
import { SlActionUndo } from "react-icons/sl";

export const ReplyPreview = ({ replyPreview, replyToMessage, onClose }) => {
    if (!replyPreview) return null;

    return (
        <div className={`
            overflow-hidden
            transition-all duration-200 ease-out
            ${replyToMessage
                ? "max-h-16 opacity-100 translate-y-0" 
                : "max-h-0 opacity-0 -translate-y-4"
            }
        `}>
            <div className="flex items-center justify-between px-4! pt-2! my-auto! select-none">
                <div className="flex flex-1 items-center gap-4 min-w-0">
                    <SlActionUndo size={22} strokeWidth={40} className="text-[#8F5EB5] shrink-0"/>
                    <div className="flex flex-col justify-center h-10 flex-1 min-w-0 bg-[#8F5EB5]/20 rounded-sm border-l-4! border-[#8F5EB5]! shrink-0 cursor-pointer hover:bg-[#8F5EB5]/15">
                        <span className="ml-2! text-sm! text-[#C083F0]">User</span>
                        <span className="ml-2! text-sm! truncate pr-2!">{replyPreview.text}</span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-[#8F5EB5]/80! hover:text-[#8F5EB5]! transition-colors cursor-pointer ml-3! shrink-0"
                >
                    <X size={24}/> 
                </button>
            </div>
        </div>
    );
}
