module.exports = {
    decodeChatMessage: decodeChatMessage
}

function decodeChatMessage(message, users) {
    try {


        // Extracting fields
        const author = message.author;
        const content = message.content;
        const timestamp = new Date(message.timestamp).toLocaleString(); // Format timestamp
        let reactionCounts = '';
        if (message.reaction_counts) {
            reactionCounts = Object.entries(message.reaction_counts)
                .map(([emoji, count]) => `${emoji}: ${count}`)
                .join(", ");
        }

        while (content.search(/<@.*>/) != -1) {
            let mention = message.content.match(/<@.*>/)[0];
            let id = mention.match(/<@(.*)>/)[1];
            let username = findUsername(id, users);
            message.content = message.content.replace(mention, `@${username}`);
        }
        // Formatting output
        return `
--- ${findUsername(author, users)}, @ ${timestamp} ---
${content}

/${reactionCounts || ""}/
`;
    } catch (error) {
        console.error("Error decoding message:", error);
        return "Invalid message format.";
    }
}

function findUsername(id, users) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].user._id == id) {
            return users[i].user.username;
        }
    }
    return 'Unknown';
}