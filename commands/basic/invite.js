const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription(lang.inviteDescription),
    async execute(interaction) {
        const clientId = interaction.client.user.id; 
        const adminPermissions = 8; 

        const inviteURL = `https://discord.com/oauth2/authorize?client_id=1311750165614432336&permissions=8&integration_type=0&scope=bot`;

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setAuthor({ 
                name: lang.inviteTitle, 
                iconURL: lang.inviteImageURL,
                url: "https://discord.gg/xQF9f9yUEM"
            })
            .setDescription(lang.inviteDescription.replace('{inviteURL}', inviteURL))
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
