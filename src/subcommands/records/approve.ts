import { SlashCommandSubcommandBuilder } from "discord.js";
import { SubCommand } from "../../classes/index";

const approve = {
  data: new SlashCommandSubcommandBuilder()
    .setName("approve")
    .setDescription("Approves the given submission."),
  execute: async (interaction) => {},
} satisfies SubCommand;

export default approve;
