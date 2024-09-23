import { ChannelType, SlashCommandSubcommandBuilder } from "discord.js";
import { SubCommand } from "../../classes/index";
import { db } from "../../handlers/database";
import baseEmbed from "../../embeds/baseEmbed";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import client from "../..";
import { embeds } from "../../config";

const feedbackChannel = {
  data: new SlashCommandSubcommandBuilder()
    .setName("records")
    .setDescription("Toggles the use of a button and form for creating submissions.")
    .addBooleanOption((option) =>
      option
        .setName("use-button")
        .setDescription("The channel you want to use for feedback.")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const _channel = interaction.options.getChannel("channel");
    const server = await db.server.upsert({
      create: {
        id: interaction.guildId,
        feedbackChannel: _channel.id,
      },
      where: {
        id: interaction.guildId,
      },
      update: {
        feedbackChannel: _channel.id,
      },
    });
    const _embed = baseEmbed()
      .setTitle("Channel Configured")
      .setDescription(
        `The Feedback Channel for this server is now set to <#${server.feedbackChannel}>`
      )
      .setColor(embeds.success);
    interaction.editReply({
      embeds: [_embed],
    });
  },
} satisfies SubCommand;
export { feedbackChannel };

export default feedbackChannel;
