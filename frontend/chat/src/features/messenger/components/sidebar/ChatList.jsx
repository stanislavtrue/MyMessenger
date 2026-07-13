import { useMessengerContext } from "@/features/messenger/context/MessengerContext";
import { ChatItem } from "./chatItem/ChatItem";

export const ChatList = ({ chats, isVisible, selectedChatId, onSelectChat }) => {
    const { contextMenu, showMenu } = useMessengerContext();

    return (
        <div className={`
            absolute inset-0
            overflow-y-auto
            chats-scroll
            transition-all duration-50 ease-out
            ${isVisible ? "opacity-100 scale-100" : "pointer-events-none"}           
        `}>
            {chats.map((chat) => {
                const isContextActive = contextMenu.visible && contextMenu.type === "chat" && contextMenu.messageData?.id === chat.id;
                const lastMessage = chat.messages[chat.messages.length - 1];

                return (
                    <ChatItem
                        key={chat.id}
                        chat={chat}
                        lastMessageText={lastMessage?.text}
                        lastMessageTime={lastMessage?.time}
                        lastMessageDate={lastMessage?.date}
                        setSelectedChatId={onSelectChat}
                        selectedChatId={selectedChatId}
                        isContextActive={isContextActive}
                        onContextMenu={(e) => showMenu(e, chat, "chat")}
                    />
                );
            })}
        </div>
    );
};
