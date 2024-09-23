import { SlashCommandSubcommandBuilder } from "discord.js";
import { SubCommand } from "../../classes/index";

const deny = {
  data: new SlashCommandSubcommandBuilder()
    .setName("deny")
    .setDescription("Denies the given submission by showing the Change Request Form."),
  execute: async (interaction) => {},
} satisfies SubCommand;

export default deny;
