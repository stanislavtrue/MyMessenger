import { BellOff, Eye, Pin, SquareArrowOutUpRight, Trash } from "lucide-react";

export const CHAT_CONTEXT_MENU = [
    {
        id: "open_tab",
        label: "Open in New Tab",
        icon: SquareArrowOutUpRight,
    },
    {
        id: "preview",
        label: "Quick Preview",
        icon: Eye,
    },
    {
        id: "pin",
        label: "Pin to Top",
        icon: Pin,
    },
    {
        id: "mute",
        label: "Mute...",
        icon: BellOff,
    },
    {
        id: "delete",
        label: "Delete Chat",
        icon: Trash,
        isDanger: true,
    }
]
