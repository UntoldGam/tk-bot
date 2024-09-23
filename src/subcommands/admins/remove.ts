import { SlashCommandSubcommandBuilder } from "discord.js";
import { SubCommand } from "../../classes";

const remove = {
  data: new SlashCommandSubcommandBuilder()
    .setName("remove")
    .setDescription("Remove a user/role from the Admin List"),
  execute: async (interaction) => {},
} satisfies SubCommand;
export { remove };

export default remove;
