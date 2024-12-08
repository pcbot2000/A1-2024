const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { Wcard } = require('wcard-gen');
const { welcomeCollection } = require('../mongodb');
const data = require('../UI/banners/welcomecards');

async function loadWelcomeConfig() {
    try {
        const configs = await welcomeCollection.find().toArray();
        return configs.reduce((acc, config) => {
            acc[config.serverId] = config;
            return acc;
        }, {});
    } catch (err) {
        //console.error('Error loading welcome config:', err);
        return {};
    }
}

function getOrdinalSuffix(number) {
    if (number === 11 || number === 12 || number === 13) {
        return 'th';
    }
    const lastDigit = number % 10;
    switch (lastDigit) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

function getRandomImage(images) {
    return images[Math.floor(Math.random() * images.length)];
}

module.exports = async (client) => {
    let welcomeConfig = await loadWelcomeConfig();

    setInterval(async () => {
        welcomeConfig = await loadWelcomeConfig();
    }, 5000);

    client.on('guildMemberAdd', async (member) => {
        const guildId = member.guild.id;
        const settings = welcomeConfig[guildId];

        if (settings && settings.status) {
            const welcomeChannel = member.guild.channels.cache.get(settings.welcomeChannelId);
            if (welcomeChannel) {
                const memberCount = member.guild.memberCount;
                const suffix = getOrdinalSuffix(memberCount);
                const userName = member.user.username;
                const joinDate = member.joinedAt.toDateString();
                const creationDate = member.user.createdAt.toDateString();
                const serverName = member.guild.name;
                const serverIcon = member.guild.iconURL({ format: 'png', dynamic: true, size: 256 });
                const randomImage = getRandomImage(data.welcomeImages);

                const welcomecard = new Wcard()
                    .setName(userName)
                    .setAvatar(member.user.displayAvatarURL({ format: 'png' }))
                    .setTitle("Welcome to Server")
                    .setColor("00e5ff") 
                    .setBackground(randomImage);
                
                const card = await welcomecard.build();
                const attachment = new AttachmentBuilder(card, { name: 'welcome.png' });

                const embed = new EmbedBuilder()
                    .setDescription("\n<a:yoyo:1315346749921038377><a:line:1197626413910597682><a:line:1197626413910597682><a:line:1197626413910597682><a:line:1197626413910597682><a:line:1197626413910597682><a:line:1197626413910597682><a:line:1197626413910597682><a:line:1197626413910597682><a:line:1197626413910597682><a:line:1197626413910597682><a:line:1197626413910597682><a:line:1197626413910597682><a:yoyo:1315346749921038377>\nㅤㅤㅤ<a:TADA:1315346911758389271><a:mrw:1197613318374961172><a:mre:1197612139599372310><a:mrl:1197612640206323712><a:mrc:1197612028165095434><a:mro:1197621678088405123><a:mrm:1197612701325721711><a:mre:1197612139599372310><a:congo:1315347007275274331>\nㅤㅤㅤㅤㅤㅤ<a:flower:1315347768545640548><a:mrt:1315349344114839683><a:mro:1315349434036649984><a:flower:1315347768545640548>\n <a:rotatingblueheart:1315350129196138496><a:mrb:1315350369001279579><a:mrr:1315350472672149586><a1315349434036649984><a:mrk:1315350693426626661><a:mre:1315350752863977604><a:mrn:1315350823030620341>ㅤ<a:mrp:1315351029503496224><a:mrl:1315351084960579604><a:mra:1315351146532962335><a:mry:1315351204376870922><a:mrz:1315351268289679370><a:rotatingpurpleheart:1315351335390154762>\n <a:skyfly:1315351529003417662><a:Wavey:1315351773929672708><a:Wavey:1315351773929672708><a:Wavey:1315351773929672708><a:Wavey:1315351773929672708><a:Wavey:1315351773929672708><a:Wavey:1315351773929672708><a:Wavey:1315351773929672708><a:Wavey:1315351773929672708><a:Wavey:1315351773929672708><a:Wavey:1315351773929672708><a:Wavey:1315351773929672708><a:Wavey:1315351773929672708><a:skyfly:1315351529003417662>\n \n <a:arrow:1197621229960564896><:cle:1197598214778540152><:hle:1197598230272278590><:ale:1197598241068425318><:tle:1197598235875889222><:sle:1197598178736885890> <a:RR1:1197595901611475014> <#1197482043550998589> <a:writing:1315357592762974329> \n <a:arrow:1197621229960564896><:rle:1197598243379486762><:ule:1197598219350315029><:lle:1197598212618461234><:ele:1197598217001517126><:sle:1197598178736885890> <a:RR1:1197595901611475014> <#1197629113419169852> <a:rules:1315359612257570917> \n <a:arrow:1197621229960564896><:rle:1197598243379486762><:ole:1197598205920161814><:lle:1197598212618461234><:ele:1197598217001517126><:sle:1197598178736885890> <a:RR1:1197595901611475014> <#1197628342887784538> <a:Loading2:1197621423204737175>")
                    .setColor("#00e5ff")
                    .setImage('attachment://welcome.png')
                    .addFields(
                        { name: 'Username', value: userName, inline: true },
                        { name: 'Join Date', value: joinDate, inline: true },
                        { name: 'Account Created', value: creationDate, inline: true }
                    )
                    .setFooter({ text: "We're Glad To Have You Here!", iconURL: serverIcon })
                    .setAuthor({name: `${member.user.username}`,iconURL: member.user.displayAvatarURL() 
    })
                    .setTimestamp();

                welcomeChannel.send({
                    content: `Hey ${member}!`,
                    embeds: [embed],
                    files: [attachment]
                });
            }
        }
    });
};
