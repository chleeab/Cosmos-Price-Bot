# Cosmos-Price-Bot

This is a simple discord bot to update the coin price by using Coingecko free API.

## How to use

First, create a bot by following https://discordjs.guide/
And invite the bot to your server.

And make sure you have already install Nodejs

```
git clone https://github.com/chleeab/Cosmos-Price-Bot.git
npm install
cp .env.sample .env
```

Replace your server ID to the `GUILDID` in `.env`.
Replace your bot token ID to the `TOKEN` in `.env`.

The bot is preseted to list out $HUAHUA price. You can change it by changing the token id.

After changing all the parameter in `.env`, you can start the bot by `node <path of your bot>/pricebot.js`

There are four slash commands to ask the bot list out the price of ATOM, OSMO, HUAHUA and JUNO. You can call the bot by `/<coin name>`

## Disclaimer
This is a very simple discord bot. If you like it, feel free to fork it and make it better.
