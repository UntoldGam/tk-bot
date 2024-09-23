import {
  SlashCommandBuilder,
} from "discord.js";
import { Command, PermissionLevel } from "../../classes";
import submissionChannel from "../../subcommands/configure/submission-channel";
import feedbackChannel from "../../subcommands/configure/feedback-channel";
// sub-commands for creating,editing and deleting
export default {
  data: new SlashCommandBuilder()
    .setName("configure")
    .setDescription("A command to change various settings for the bot")
    .addSubcommand(submissionChannel.data)
    .addSubcommand(feedbackChannel.data),
  permissions: {
    authNeeded: true,
    rolesAllowed: [PermissionLevel.ServerAdmin],
  },
  properties: {
    cooldown: 5,
    enabled: true,
    deferReply: true,
    ephemeral: false,
  },
  execute: async (interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "submission-channel":
        submissionChannel.execute(interaction);
        break;
      case "feedback-channel":
        feedbackChannel.execute(interaction);
        break;
      default:
        break;
    }
  },
} satisfies Command;
