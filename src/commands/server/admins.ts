import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";
import { Command, PermissionLevel } from "../../classes";
import { add, autoSet, list, remove } from "../../subcommands/admins/index";
// sub-commands for creating,editing and deleting
export default {
  data: new SlashCommandBuilder()
    .setName("admins")
    .setDescription(
      "A command to add or remove a role from the Admins or list the current Admins"
    )
    .addSubcommand(list.data)
    .addSubcommand(remove.data)
    .addSubcommand(add.data)
    .addSubcommand(autoSet.data),
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
      case "add":
        add.execute(interaction);
        break;
      case "remove":
        remove.execute(interaction);
        break;
      case "list":
        list.execute(interaction);
        break;
      case "auto-set":
        autoSet.execute(interaction);
        break;
      default:
        break;
    }
  },
} satisfies Command;
