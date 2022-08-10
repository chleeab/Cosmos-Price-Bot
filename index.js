const { default: axios } = require("axios");
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, ActivityType,  IntentsBitField } = require("discord.js");
const dotenv = require("dotenv")

const myIntents = new IntentsBitField()
myIntents.add(IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers);

const client = new Client({ intents: myIntents });

dotenv.config()
const token = process.env.TOKEN
const clientId = process.env.CLIENTID
const guildId = process.env.GUILDID
let huahuaPrice = ""
const cooldown = new Set();
///This is 1 minute, you can change it to whatever value
const cooldownTime = 60000; 

const commands = [
    new SlashCommandBuilder().setName('atom').setDescription("ATOM Price"),
    new SlashCommandBuilder().setName('osmosis').setDescription("Osmo Price"),
    new SlashCommandBuilder().setName('chihuahua').setDescription("Chihuahua Price"),
    new SlashCommandBuilder().setName('juno').setDescription("Juno Price")
]
    .map(command => command.toJSON())

const rest = new REST({ version: '10' }).setToken(token)

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => {
        console.log("Successfully create commands")
    }).catch(console.error)

async function updateName(tokenid) {
    await axios.get("https://api.coingecko.com/api/v3/coins/"+tokenid).then((res) => {
        huahuaPrice = res.data.market_data.current_price.usd.toString()
    })
    let time = new Date().getUTCHours() + ":" + new Date().getUTCMinutes()
    try {
        (await (await client.guilds.fetch(guildId)).members.fetchMe()).setNickname(`$${huahuaPrice}(${time})`)
    } catch (error) {
        (await (await client.guilds.fetch(guildId)).members.fetchMe()).setNickname(`I am down! Restart me`)
        console.log (error)
    }
    return
}

async function getPrice(tokenid) {
    let result = ""
    await axios.get("https://api.coingecko.com/api/v3/coins/"+tokenid).then((res) => {
        let current_price = res.data.market_data.current_price.usd.toString()
        let price24h = res.data.market_data.price_change_percentage_24h.toString().slice(0,6) + "%"
        let price7d = res.data.market_data.price_change_percentage_7d.toString().slice(0,6) + "%"
        // let price14d = res.data.market_data.price_change_percentage_14d.toString().slice(0,6) + "%"
        result = tokenid +"\nPrice:" + current_price +"\n24hrs change:" + price24h + "\n7d change:" + price7d
    })
    return result
}

function botcooldown(interaction){
    cooldown.add(interaction.user.id);
    setTimeout(() => {
      // Removes the user from the set after 1 minute
      cooldown.delete(interaction.user.id);
    }, cooldownTime);
}

client.on('ready', () => {
    updateName( process.env.CHIHUAHUA)
    client.user.setActivity('$HUAHUA. Stake with SF RES Land if you like me', { type: ActivityType.Watching })
    setInterval(()=> updateName(process.env.CHIHUAHUA), 1000*90)
  });

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return
    if (cooldown.has(interaction.user.id)) {
        /// If the cooldown did not end
        interaction.reply({ content: "Bot cooling down. Please wait 1 minute", ephemeral: false });
        return
      }

    const { commandName } = interaction



    if (commandName === 'chihuahua') {
        let result = await getPrice(process.env.CHIHUAHUA)
        await interaction.reply(`${result}`);
        botcooldown(interaction)
    } else if (commandName === 'atom'){
        let result = await getPrice(process.env.ATOM)
        await interaction.reply(`${result}`);
        botcooldown(interaction)
    } else if (commandName === 'osmosis'){
        let result = await getPrice(process.env.OSMO)
        await interaction.reply(`${result}`);
        botcooldown(interaction)
    } else if (commandName ==='juno'){
        let result = await getPrice(process.env.JUNO)
        await interaction.reply(`${result}`);
        botcooldown(interaction)
    } 

})


client.login(process.env.TOKEN)
