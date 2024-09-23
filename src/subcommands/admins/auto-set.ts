import { SlashCommandSubcommandBuilder } from "discord.js";
import { SubCommand } from "../../classes/index";
import baseEmbed from "../../embeds/baseEmbed";
import guildSetup from "../../handlers/guildSetup";
import client from "../..";
import { embeds } from "../../config";
import { Admin, AdminType } from "@prisma/client";

const autoSet = {
  data: new SlashCommandSubcommandBuilder()
    .setName("auto-set")
    .setDescription(
      "Automatically generates Admins for the Bot based on existing roles."
    ),
  execute: async (interaction) => {
    const server = await guildSetup(client, interaction.guild);
    const userAdmins: string[] = server.admins
    .filter((admin: Admin) => admin.type == AdminType.USER)
    .map((user) => `<@${user.id}> - ${user.id}`);
  const roleAdmins: string[] = server.admins
    .filter((admin) => admin.type == AdminType.ROLE)
    .map((role) => `<@&${role.id}> - ${role.id}`);
    const embed = baseEmbed()
      .setTitle("Admins Configured Successfully")
      .setDescription(
        `See below for the Admin Roles and Users that have been configured for this server. To make changes, please use the corresponding \`/admins add\` and \`/admins remove\``
      ).addFields(
        {
          name: "Users",
          value: userAdmins.join("\n"),
        },
        {
          name: "Roles",
          value: roleAdmins.join("\n"),
        }
      )
      .setColor(embeds.success);
      interaction.editReply({
        embeds: [embed]
      })
    },
} satisfies SubCommand;

export { autoSet };

export default autoSet;
