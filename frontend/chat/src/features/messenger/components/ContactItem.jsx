import { useRipple } from "@/hooks/useRipple";
import { ChatStatus } from "./ChatStatus";
import { Avatar } from "./Avatar";

export const ContactItem = ({ contact, isSelected, onSelect }) => {
    const { ripples, createRipple } = useRipple();

    const handleClick = (e) => {
        createRipple(e);

        setTimeout(() => {
            onSelect(contact.id);
        }, 80);
    };

    return (
        <div
            style={{ fontFamily: "Roboto" }}
            onClick={handleClick}
            className={`
                relative flex items-center gap-5 px-3! py-1.5!
                w-[97%] rounded-2xl m-auto!
                select-none overflow-hidden
                transition-colors duration-0 
                cursor-pointer hover:bg-[#282836]
            `}
        >
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="animate-ripple"
                    style={{
                        top: ripple.y,
                        left: ripple.x,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                />
            ))}

            <Avatar
                size="size-10!"
                name={contact.user.displayName}
                avatar={contact.user.avatar}
            />
            <div className="flex flex-col flex-1 min-w-0">
                <span className="truncate">{contact.user.displayName}</span>
                <ChatStatus status={contact.user.status} />
            </div>

        </div>
    );
}
