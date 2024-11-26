module.exports = {
    decodeChatMessage: decodeChatMessage
}

function decodeChatMessage(message, users) {
    try {


        // Extracting fields
        // [{"_id":"01J2EXQ8QW2761NS61DK9ZEM0D","tag":"attachments","filename":"welcome_to_the_ai_automation_agency_campus.mp3","metadata":{"type":"Audio","duration":1563},"content_type":"audio/mpeg","size":26569686}]
        let attachments = message.attachments || [];
        let attachmentString = '';
        for (let i = 0; i < attachments.length; i++) {
            let formattedSize = (attachments[i].size / 1024 / 1024).toFixed(2) + "MB";
            let metadata = "";
            for (key in attachments[i].metadata) {
                if (key == 'placeholder') {
                    continue;
                }
                metadata += `${key} - ${attachments[i].metadata[key]}, `;
            }
            attachmentString += `::${attachments[i].filename} - ${formattedSize} (${metadata})\n`;
        }
        console.log(attachmentString);
        let author = message.author;
        let content = message.content || "";
        let timestamp = new Date(message.timestamp).toLocaleString(); // Format timestamp
        let reactionCounts = '';
        if (message.reaction_counts) {
            reactionCounts = Object.entries(message.reaction_counts)
                .map(([emoji, count]) => `${emoji}: ${count}`)
                .join(", ");
        }
        let k = 0;

        let mentions = content.match(/<@.{26}?>/g);
        if (!mentions) {
            mentions = [];
        }
        for (let k = 0; k < mentions.length; k++) {
            // console.log(mentions[k]);
            let username = findUsername(mentions[k].slice(2, -1), users);
            content = content.replace(mentions[k], `@${username}`);
        }

        // Formatting output
        return `
--- ${findUsername(author, users)}, $ ${timestamp} ---
${content}

${attachmentString}

/${reactionCounts || ""}/
`;
    } catch (error) {
        console.error("Error decoding message:", error);
        return "Invalid message format.";
    }
}

function findUsername(id, users) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].user._id == id || users[i].member._id.user == id) {
            return users[i].user.username;
        }
    }
    // console.log("Unknown user: " + id);
    return 'Unknown'; // TODO handle unknown users better
}