import { Pin, PinOff, Trash } from "lucide-react";
import { MdOutlineContentCopy } from "react-icons/md";
import { SlActionRedo, SlActionUndo } from "react-icons/sl";

export const MESSAGE_CONTEXT_MENU = [
    {
        id: "reply",
        label: () => "Reply",
        icon: SlActionUndo,
        strokeWidth: 25,
        action: (message, context) => {
            context.openReply(message);
            document.getElementById("message-input")?.focus();
        }
    },
    {
        id: "copy",
        label: () => "Copy Text",
        icon: MdOutlineContentCopy,
        strokeWidth: 0,
        action: async (message, context) => {
            if (!message?.text) return;
            try {
                await navigator.clipboard.writeText(message.text);
                context.showToast("Copied to Clipboard");
            } catch (err) {
                console.log("Failed to copy text", err);
            }
        }
    },
    {
        id: "pin",
        label: (message, context) => {
            const pinnedMessages = context.selectedChat?.pinnedMessages || [];
            return pinnedMessages.some(msg => msg.id === message?.id) ? "Unpin" : "Pin";
        },
        icon: Pin,
        strokeWidth: 2,
        action: (message, context) => {
            const pinnedMessages = context.selectedChat?.pinnedMessages || [];
            const isCurrentPinned = pinnedMessages.some(msg => msg.id === message.id);

            if (isCurrentPinned) {
                context.handleUnpinMessage(context.selectedChatId, message.id);
            } else {
                context.handlePinMessage(context.selectedChatId, message);
            }
        }
    },
    {
        id: "forward",
        label: () => "Forward",
        icon: SlActionRedo,
        strokeWidth: 25
    },
    {
        id: "delete",
        label: () => "Delete",
        icon: Trash,
        strokeWidth: 2,
        isDanger: true,
        action: (message, context) => {
            context.handleDeleteMessage(context.selectedChatId, message.id);
        }
    }
]
