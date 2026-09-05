export const toggleOwnReaction = (currentReactions = [], emoji) => {
    const existingReactionIndex = currentReactions.findIndex(r => r.isOwn);
    let updatedReactions = [...currentReactions];

    if (existingReactionIndex !== -1) {
        const existingReaction = currentReactions[existingReactionIndex];

        if (existingReaction.emoji === emoji) {
            if (existingReaction.count === 1){
                updatedReactions.splice(existingReactionIndex, 1);
            } else {
                updatedReactions[existingReactionIndex] = {
                    ...existingReaction,
                    count: existingReaction.count - 1,
                    isOwn: false
                };
            }
        } else {
            updatedReactions[existingReactionIndex] = {
                ...existingReaction,
                count: existingReaction.count - 1,
                isOwn: false
            };

            const targetIndex = updatedReactions.findIndex(r => r.emoji === emoji);

            if (targetIndex !== -1) {
                updatedReactions[targetIndex] = {
                    ...updatedReactions[targetIndex],
                    count: updatedReactions[targetIndex].count + 1,
                    isOwn: true
                };
            } else {
                updatedReactions.push({ emoji, count: 1, isOwn: true });
            }
        }
    } else {
        const targetIndex = updatedReactions.findIndex(r => r.emoji === emoji);
        if (targetIndex !== -1) {
            updatedReactions[targetIndex] = {
                ...updatedReactions[targetIndex],
                count: updatedReactions[targetIndex].count + 1,
                isOwn: true
            };
        } else {
            updatedReactions.push({ emoji, count: 1, isOwn: true });
        }
    }

    return updatedReactions.filter(r => r.count > 0);
}
