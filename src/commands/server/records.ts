import { Embed, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command, PermissionLevel } from "../../classes";
import guildSetup from "../../handlers/guildSetup";
import { newRecord } from "../../subcommands/records";
// sub-commands for creating,editing and deleting
export default {
  data: new SlashCommandBuilder()
    .setName("records")
    .setDescription(
      "A command to add, delete or edit a record that you have created"
    )
    .addSubcommand(newRecord.data),
  permissions: {
    authNeeded: false,
    rolesAllowed: [],
  },
  properties: {
    cooldown: 5,
    enabled: true,
    deferReply: true,
    ephemeral: false,
  },
  execute: async (interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "new":
        newRecord.execute(interaction);
        break;
      default:
        break;
    }
  },
} satisfies Command;
