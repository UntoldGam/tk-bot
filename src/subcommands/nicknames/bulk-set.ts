// Allows you to set the nicknames of all users in a certain role
import { SlashCommandSubcommandBuilder } from "discord.js";
import { SubCommand } from "../../classes/index";

const bulkSet = {
  data: new SlashCommandSubcommandBuilder()
    .setName("bulk-set")
    .setDescription("Set the nicknames of all users within a certain role")
    .addRoleOption((option) => {
      return option
        .setName("role")
        .setDescription("Will set the nickname of all users who have this role in the server")
        .setRequired(true);
    }),
  execute: async (interaction) => {
    
  },
} satisfies SubCommand;
export { bulkSet };

export default bulkSet;
