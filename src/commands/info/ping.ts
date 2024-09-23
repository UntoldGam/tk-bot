import client from "../..";
import { Command } from "../../classes/";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import baseEmbed from "../../embeds/baseEmbed";
import config from "../../config";
export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the bot's latency.")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  permissions: {
    authNeeded: false,
    rolesAllowed: [],
  },
  properties: {
    cooldown: 10,
    enabled: true,
    deferReply: false,
    ephemeral: true,
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    try {
      // Get ping
      const botLatency = Date.now() - interaction.createdTimestamp;
      const apiLatency = Math.round(client.ws.ping);

      let botLatencyValue;
      let apiLatencyValue;

      // Set which connection emoji to use for botLatency
      if (botLatency >= 0 && botLatency <= 99) {
        botLatencyValue = `${config.emojis.connection_excellent} ${botLatency}ms`;
      } else if (botLatency >= 100 && botLatency <= 199) {
        botLatencyValue = `${config.emojis.connection_good} ${botLatency}ms`;
      } else {
        botLatencyValue = `${config.emojis.connection_bad} ${botLatency}ms`;
      }

      // Set which connection emoji to use for apiLatency
      if (apiLatency >= 0 && apiLatency <= 99) {
        apiLatencyValue = `${config.emojis.connection_excellent} ${apiLatency}ms`;
      } else if (apiLatency >= 100 && apiLatency <= 199) {
        apiLatencyValue = `${config.emojis.connection_good} ${apiLatency}ms`;
      } else {
        apiLatencyValue = `${config.emojis.connection_bad} ${apiLatency}ms`;
      }

      const ping = baseEmbed()
        .setTitle(`Ping!`)
        .addFields(
          { name: "Bot Latency", value: botLatencyValue, inline: true },
          { name: "API Latency", value: apiLatencyValue, inline: true }
        );

      await interaction.reply({ embeds: [ping], ephemeral: true });
    } catch (err) {
      client.logCommandError(err, interaction);
    }
  },
} satisfies Command;
