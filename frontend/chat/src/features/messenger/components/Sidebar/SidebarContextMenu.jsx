import { CHAT_CONTEXT_MENU } from "../../constants/sidebarMenuItems";
import { ContextMenuWrapper } from "../ContextMenuWrapper";

export const SidebarContextMenu = ({ closeMenu }) => {
    return (
        <ContextMenuWrapper type="chat" width="w-48">
            {CHAT_CONTEXT_MENU.map((item) => {
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => closeMenu()}
                        className={`
                            flex items-center gap-5 px-3! py-1.5! text-sm! font-semibold! rounded-2xl
                            cursor-pointer transition-colors duration-0 w-full text-left
                            ${item.isDanger
                                ? "text-red-500! hover:bg-[#282835]/50! hover:text-white!"
                                : "text-white hover:bg-[#282836]/50!"
                            }
                        `}
                    >
                        <Icon strokeWidth={2.5} size={18} className={item.isDanger ? "" : "text-[#8888BA]"} />
                        <span>{item.label}</span>
                    </button>
                );
            })}
        </ContextMenuWrapper>
    );
};
