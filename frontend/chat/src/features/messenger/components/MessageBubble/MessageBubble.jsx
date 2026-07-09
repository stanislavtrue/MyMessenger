import { useMessengerContext } from "../../context/MessengerContext";
import { highlightText } from "../../utils/highlightText";
import { ActiveReactionBadge } from "./ActiveReactionBadge";
import { QuickReactionButton } from "./QuickReactionButton";
import { BubbleContainer } from "./BubbleContainer";
import { BubbleFooter } from "./BubbleFooter";
import { ReplyPreview } from "./ReplyPreview";

export const MessageBubble = ({ message, isFirstMessage, isLastMessage }) => {
    const { chatSearchText, handleSetReaction, selectedChat, currentUser } = useMessengerContext();

    return (
        <BubbleContainer 
            isOwnMessage={message.isOwnMessage}
            isFirstMessage={isFirstMessage}
            isLastMessage={isLastMessage}
        >
            <ReplyPreview message={message} />

            <div className="flex items-end justify-between w-full gap-2">
                <div className="flex flex-col z-10">
                    <span className="flex-1 text-white! text-sm! whitespace-pre-wrap! overflow-hidden">
                        {highlightText(message.text, chatSearchText)}
                    </span>

                    <QuickReactionButton 
                        isOwnMessage={message.isOwnMessage}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSetReaction(message.id, "❤️")
                        }}
                    />

                    {message.reactions && message.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1! max-w-full">
                            {message.reactions.map((reaction, idx) => {
                                const reactionUser = reaction.userId === currentUser.id ? currentUser : selectedChat.user;

                                return (
                                    <ActiveReactionBadge
                                        key={reaction.userId}
                                        reaction={reaction.emoji}
                                        user={reactionUser}
                                        isOwnMessage={message.isOwnMessage}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSetReaction(message.id, reaction.emoji);
                                        }}
                                    />
                                )
                            })}
                        </div>
                    )}
                </div>

                <BubbleFooter 
                    isPinned={message.isPinned}
                    time={message.time}
                    isOwnMessage={message.isOwnMessage}
                    status={message.status}
                />
            </div>
        </BubbleContainer>
    );
};
