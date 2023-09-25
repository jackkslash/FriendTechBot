# FriendTech Bot

A Discord bot that notifies users of new users, 0 key buys, current information on users and charts of key prices.

## Installation

Clone the repo and install dependencies needed.

```
git clone https://github.com/jackkslash/FriendTechBot.git
npm install
```

### .env

Rename the '.env.example' file to '.env' and fill in the required environment variables. All of them are needed to run the bot.

```
CLIENTID=
GUILDID=
DISCORDBOTTOKEN=
CHARTCHANNELID=
ZEROSHARECHANNELID=
ZEROSHARE10CHANNELID=
ZEROSHARE50CHANNELID=
ZEROSHARENOTABLECHANNELID=
NEWUSERSCHANNELID=
NEWUSERSNOTABLECHANNELID=
IMGAPI=
BASERPC=
FTAUTHTOKEN=
FTUSERID=
```

### NPM Scripts

```
    "build": "rimraf ./build && tsc",
    "deploy": "tsc && node build/deployCommands.js",
    "start": "npm run deploy && npm run build && node build/index.js"
```

```
npm run start
```

This command above is the only one needed to run the bot. It will deploy commands before the bot is up and running.

```
npm run deploy
```

If commands need to be deployed separately, run the command mentioned above.
