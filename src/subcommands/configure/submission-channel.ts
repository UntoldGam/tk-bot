import { ChannelType, SlashCommandSubcommandBuilder } from "discord.js";
import { SubCommand } from "../../classes/index";
import { db } from "../../handlers/database";
import baseEmbed from "../../embeds/baseEmbed";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import client from "../..";
import { embeds } from "../../config";

const submissionChannel = {
  data: new SlashCommandSubcommandBuilder()
    .setName("submission-channel")
    .setDescription("Set the channel that will be used for Submissions.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel you want to use for submissions")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const _channel = interaction.options.getChannel("channel");
    const server = await db.server.upsert({
      create: {
        id: interaction.guildId,
        submissionsChannel: _channel.id,
      },
      where: {
        id: interaction.guildId,
      },
      update: {
        submissionsChannel: _channel.id,
      },
    });
    const _embed = baseEmbed()
      .setTitle("Channel Configured")
      .setDescription(
        `The Submissions Channel for this server is now set to <#${server.submissionsChannel}>`
      )
      .setColor(embeds.success);
    interaction.editReply({
      embeds: [_embed],
    });
  },
} satisfies SubCommand;
export { submissionChannel };

export default submissionChannel;
