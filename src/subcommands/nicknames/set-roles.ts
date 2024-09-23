// Allows you to set the roles that the bot will check for when setting nicknames
// Allows you to set the nicknames of all users in a certain role
import { SlashCommandSubcommandBuilder } from "discord.js";
import { SubCommand } from "../../classes/index";

const setRoles = {
  data: new SlashCommandSubcommandBuilder()
    .setName("set-roles")
    .setDescription(
      "Set the roles that the bot should check against when formatting usernames"
    )
    .addStringOption((option) => {
      return option
        .setName("roles")
        .setDescription("A comma-separated list of role Ids e.g. 123,456,789")
        .setRequired(true);
    }),
  execute: async (interaction) => {
    // validate given roles against regex statement, check for just numbers
    // remove spaces
    // split by the comma
    // set in the db
    const pattern = new RegExp("^d+(,d+)*$");
    let rolesString = interaction.options.getString("roles");
    //rolesString = rolesString.trim();
    if (pattern.test(rolesString)) {
      // pattern matches
      const roleIds = rolesString.split(",");
      // add to db as string array (roleIds)
      interaction.editReply({
        content: "OMG THEY ARE CORECT!",
      });
    }
    // return an error msg, perhaps put in bold the errors found?
  },
} satisfies SubCommand;
export { setRoles };

export default setRoles;
