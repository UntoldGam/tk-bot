import { SlashCommandSubcommandBuilder } from "discord.js";
import { SubCommand } from "../../classes/index";

const add = {
  data: new SlashCommandSubcommandBuilder()
    .setName("add")
    .setDescription("Add a new user/role admin"),
  execute: async (interaction) => {},
} satisfies SubCommand;
// use role select menu / user select menu
export {
  add
}

export default add;
