const embedBuilder = require("../../datastore/embedBuilder.js");

let guildConfigs = {};

const setWarnChannel = (guildId, channelId) => {
    if (!guildConfigs[guildId]) {
        guildConfigs[guildId] = {};
    }
    guildConfigs[guildId].warnChannel = channelId;
};

// const getWarnChannel = (guildId) => {
//     return guildConfigs[guildId] ? guildConfigs[guildId].warnChannel : null;
// };

const verifyWarnChannel = async (msg) => {
    const warnChannelId = getWarnChannel(msg.guildId);
    if (!warnChannelId) {
        await msg.channel.send({ embeds: [embedBuilder.warnErrorEmbed('configNotFound')] });
        return null;
    }
    let warnChannel;
    try {
        warnChannel = await msg.guild.channels.fetch(warnChannelId);
    } catch (error) {
        await msg.channel.send({ embeds: [embedBuilder.warnErrorEmbed('fetchError', error.message)] });
        return null;
    }
    if (!warnChannel) {
        await msg.channel.send({ embeds: [embedBuilder.warnErrorEmbed('channelNotFound', `ID: ${warnChannelId}`)] });
        return null;
    }
    return warnChannel;
}

const configureWarnChannel = async (msg, args) => {
    if (args.length === 0) {
        await msg.reply({ embeds: [embedBuilder.customErrorEmbed("Configuration Error", "Please provide a valid channel ID for configuration.")] });
        return;
    }
    
    const channelId = args[0];
    const channel = msg.guild.channels.cache.get(channelId);
    
    if (!channel) {
        await msg.reply({ embeds: [embedBuilder.warnErrorEmbed('channelNotFound', `ID: ${channelId}`)] });
        return;
    }
    
    setWarnChannel(msg.guildId, channelId);
    await msg.reply({ embeds: [embedBuilder.warnSuccessEmbed(channelId)] });
};
//getWarnChannel,
module.exports = { setWarnChannel, verifyWarnChannel, configureWarnChannel };
