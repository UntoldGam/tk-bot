import { Command } from "../../classes/";
import {
  ButtonBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import client from "../..";
import { ActionRowBuilder, ButtonStyle } from "discord.js";
import baseEmbed from "../../embeds/baseEmbed";

const bot = require("../../../package.json");

export default {
  data: new SlashCommandBuilder()
    .setName("bot")
    .setDescription("Different information about the bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  permissions: {
    authNeeded: false,
    rolesAllowed: [],
  },
  properties: {
    cooldown: 5,
    enabled: true,
    deferReply: true,
    ephemeral: true,
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    try {
      const info = baseEmbed()
        .setAuthor({
          name: interaction.client.user.tag,
          iconURL: interaction.client.user.displayAvatarURL({
            extension: "png",
            forceStatic: false,
          }),
        })
        .setDescription(bot.description)
        .addFields(
          { name: "📈 Version", value: bot.version, inline: true },
          {
            name: "🟢 Online Since",
            value: `<t:${(Date.now() - interaction.client.uptime)
              .toString()
              .slice(0, -3)}:f>`,
            inline: true,
          }
        );

      const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setEmoji("🐙")
          .setLabel("GitHub")
          .setURL("https://github.com/UntoldGam/tk-bot")
      );

      await interaction.editReply({ embeds: [info], components: [buttons] });
    } catch (err) {
      client.logCommandError(err, interaction);
    }
  },
} satisfies Command;
