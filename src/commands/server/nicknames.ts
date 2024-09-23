import { SlashCommandBuilder } from "discord.js";
import { Command, PermissionLevel } from "../../classes";
import { bulkSet, setRoles } from "../../subcommands/nicknames/index";
// sub-commands for creating,editing and deleting
export default {
  data: new SlashCommandBuilder()
    .setName("nicknames")
    .setDescription(
      "A command to change or use the Automatic Nicknaming System in the server"
    )
    .addSubcommand(bulkSet.data)
    .addSubcommand(setRoles.data),
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
      case "bulk-set":
        bulkSet.execute(interaction);
        break;
      case "set-roles":
        setRoles.execute(interaction);
        break;
      default:
        break;
    }
  },
} satisfies Command;