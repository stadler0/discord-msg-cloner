const { Client } = require('discord.js-selfbot-v13');
const axios = require('axios');
const moment = require('moment-timezone');
const fs = require('fs');
const express = require('express');

const client = new Client();
const app = express();
// This is the port the webserver be exposed on. You can change it if you want :)
const port = 8211;

const token = 'INSERT_USER_TOKEN_HERE';
const sourceGuildId = 'INSERT_GUILD_ID_HERE';
const webhookUrl = 'INSERT_WEBHOOK_HERE';
const chatFilePath = 'INSERT_PATH_HERE';

// Set up express routes
app.get('/', (req, res) => {
    res.send('<a href="/messages">Show mirrored messages</a>');
});

app.get('/messages', (req, res) => {
    // Read chat history from file
    fs.readFile(chatFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading chat.txt file:', err);
            res.status(500).send('Internal server error!');
            return;
        }
        // Split data by new lines and send as response
        const messages = data.split('\n').filter(line => line.trim() !== '');
        res.json(messages);
    });
});

app.listen(port, () => {
    console.log(`Webserver runs on http://localhost:${port}`);
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    // Check whether the message comes from the source guild
    if (message.guild && message.guild.id === sourceGuildId) {
        try {
            const sourceGuildName = message.guild.name;
            const channelName = message.channel.name;
            // Change timezone here
            const timestamp = moment().tz('Europe/Berlin').format('YYYY-MM-DD HH:mm:ss');

            // Create the first line with source guild, roles and author details
            let authorRoles = message.member.roles.cache.filter(role => role.name !== '@everyone').map(role => role.name).join(', ');
            const authorRolesLine = authorRoles ? `Roles: ${authorRoles}` : '';
            const authorDetailsLine = `**[${message.author.id} - ${message.author.tag}]${authorRolesLine ? ' - ' + authorRolesLine : ''} in #${channelName}**`;
            const sourceGuildLine = `New message in "${sourceGuildName}"`;

            // Create the basic message with the counters
            let content = `${sourceGuildLine}\n${authorDetailsLine}\n\n${message.content}\n\n*Sent at ${timestamp}*\n\n`;

            // Check whether media, files or stickers have been attached
            if (message.attachments.size > 0) {
                const attachmentLinks = message.attachments.map(attachment => attachment.url).join('\n');
                content += `\n\n**Attachments:**\n${attachmentLinks}`;
            }

            if (message.stickers.size > 0) {
                const stickerNames = message.stickers.map(sticker => sticker.name).join(', ');
                content += `\n\n**Sticker:** ${stickerNames}`;
            }

            // Send the message via the webhook
            await axios.post(webhookUrl, {
                content: content
            });

            console.log('Message successfully mirrored:', content);

            // Save the message to the chat file
            fs.appendFile(chatFilePath, `${timestamp} - ${message.author.tag}: ${message.content}\n`, 'utf8', (err) => {
                if (err) {
                    console.error('Error saving content to chat file:', err);
                }
            });
        } catch (error) {
            console.error('Error mirroring message:', error);
        }
    }
});


client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (newMessage.guild && newMessage.guild.id === sourceGuildId) {
        try {
            // Send a message to the webhook indicating that a message has been processed
            const oldContent = oldMessage.content;
            const newContent = newMessage.content;
            const authorId = oldMessage.author.id;
            const authorName = oldMessage.author.username;
            const channelName = oldMessage.channel.name;
            // Change timezone here
            const timestamp = moment().tz('Europe/Berlin').format('DD-MM-YYYY HH:mm:ss');
            const editedMessageContent = `Message from user ${authorId} (${authorName}) in channel #${channelName} edited at ${timestamp}\n\n**Before:**\n${oldContent}\n\n**After:**\n${newContent}`;

            await axios.post(webhookUrl, {
                content: editedMessageContent
            });

            console.log('Message successfully edited:', editedMessageContent);
        } catch (error) {
            console.error('Error sending edited message:', error);
        }
    }
});

client.login(token);
