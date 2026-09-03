import { useMessengerContext } from "@/features/messenger/context/MessengerContext";
import { BubbleContainer } from "./BubbleContainer";
import { ReplyPreview } from "./ReplyPreview";
import { highlightText } from "@/features/messenger/utils/highlightText";
import { QuickReactionButton } from "./QuickReactionButton";
import { ActiveReactionBadge } from "./ActiveReactionBadge";
import { BubbleFooter } from "./BubbleFooter";

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
                    <span className="flex-1 text-white! text-[15px]! whitespace-pre-wrap! overflow-hidden">
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
                                return (
                                    <ActiveReactionBadge
                                        key={reaction.emoji}
                                        reaction={reaction.emoji}
                                        count={reaction.count}
                                        isOwnReaction={reaction.isOwn}
                                        currentUser={currentUser}
                                        companion={selectedChat.user}
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
