import { EmbedBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { SubCommand } from "../../classes";
import { Admin, AdminType } from "@prisma/client";
import { embeds } from "../../config";
import { db } from "../../handlers/database";
import baseEmbed from "../../embeds/baseEmbed";

const list = {
  data: new SlashCommandSubcommandBuilder()
    .setName("list")
    .setDescription("Lists all the current Admins (Roles and Users)")
    .addStringOption((option) => {
      return option
        .setName("filter")
        .setDescription(
          "This will filter down the results to only show users/roles"
        )
        .addChoices(
          {
            name: "Users",
            value: "users",
          },
          {
            name: "Roles",
            value: "roles",
          }
        )
        .setRequired(false);
    }),
  execute: async (interaction) => {
    const server = await db.server?.findUnique({
      where: {
        id: interaction.guildId,
      },
    });
    if (!server || !server.admins) {
      interaction.editReply({
        content:
          "An error occured whilst fetching the server's admin roles, consult a developer for more information.",
      });
      return;
    }
    const userAdmins: string[] = server.admins
      .filter((admin: Admin) => admin.type == AdminType.USER)
      .map((user) => `<@${user.id}> - ${user.id}`);
    const roleAdmins: string[] = server.admins
      .filter((admin) => admin.type == AdminType.ROLE)
      .map((role) => `<@&${role.id}> - ${role.id}`);

    const embed = baseEmbed().setTitle("Admins");
    switch (interaction.options.getString("filter")) {
      case "users":
        embed
          .setDescription(
            "Here are the configured Admin Users for this Server (for the bot)."
          )
          .addFields({
            name: "Users",
            value: userAdmins.join("\n"),
          });
        break;
      case "roles":
        embed
          .setDescription(
            "Here are the configured Admin Roles for this Server (for the bot)."
          )
          .addFields({
            name: "Roles",
            value: roleAdmins.join("\n"),
          });
        break;
      default:
        embed
          .setDescription(
            "Here are the configured Admin Roles and Users for this Server (for the bot)."
          )
          .addFields(
            {
              name: "Users",
              value: userAdmins.join("\n"),
            },
            {
              name: "Roles",
              value: roleAdmins.join("\n"),
            }
          );
    }
    interaction.editReply({
      embeds: [embed],
    });
  },
} satisfies SubCommand;
export { list };
export default list;
