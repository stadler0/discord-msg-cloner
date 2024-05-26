# discord-msg-cloner
This script clones messages from one Discord server to another one via webhook

# **DISCLAIMER:**
I'm not responsible for any damages or bans this software may cause after being acquired. This software was made for personal education and sandbox testing. This software is against Discords TOS!


Part of this script is still in german but will be translated later. If you use this software for anything public please credit me as an author :)

There should be no calls made to the discord API so you should be pretty safe if you use it. Still..  I do not take resposibility if you get banned.

# Install

To install this software, you first need Node.js on your system. If you don't have Node.js installed, you can download and install it from the official website: https://nodejs.org/

Once Node.js is installed, you can follow these steps:

Open the command line or terminal.

Navigate to the directory where the index.js file is located.

Run the command **"npm install discord.js-selfbot-v13 axios moment-timezone express ejs"** to install the required dependencies.

**Open the index.js file in a text editor.**

Replace 'INSERT_USER_TOKEN_HERE' with your Discord user token.

Replace 'INSERT_GUILD_ID_HERE' with the ID of the source guild from which messages should be mirrored.

Replace 'INSERT_WEBHOOK_HERE' with the URL of the webhook to which messages should be sent.

Replace 'INSERT_PATH_HERE' with the path to the chat file where messages should be saved.

Save the file and close it.

Run the command **"node index.js"** to run the bot.

The bot should now start and begin mirroring messages from the specified server and sending them to the specified webhook. The web server should be running on port 8211, and you can access the homepage to find a link to the mirrored messages.
