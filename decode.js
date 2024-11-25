module.exports = {
    decodeChatMessage: decodeChatMessage
}

function decodeChatMessage(message, users) {
    try {


        // Extracting fields
        let author = message.author;
        let content = message.content;
        let timestamp = new Date(message.timestamp).toLocaleString(); // Format timestamp
        let reactionCounts = '';
        if (message.reaction_counts) {
            reactionCounts = Object.entries(message.reaction_counts)
                .map(([emoji, count]) => `${emoji}: ${count}`)
                .join(", ");
        }
        let k = 0;

        let mentions = content.match(/<@.*?>/g);
        if (!mentions) {
            mentions = [];
        }
        for (let k = 0; k < mentions.length; k++) {
            console.log(mentions[k]);
            let username = findUsername(mentions[k].slice(2, -1), users);
            content = content.replace(mentions[k], `@${username}`);
        }

        // Formatting output
        return `
--- ${findUsername(author, users)}, $ ${timestamp} ---
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