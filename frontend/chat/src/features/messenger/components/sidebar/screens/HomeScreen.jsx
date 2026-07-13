import { ChatList } from "../ChatList";

export const HomeScreen = ({ activeChats, selectedChatId, handleSelectChat }) => {
    return (
        <ChatList
            chats={activeChats}
            isVisible={true}
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
        />
    );
};
