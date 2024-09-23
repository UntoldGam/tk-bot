import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { Command, PermissionLevel } from "../../classes";
import guildSetup from "../../handlers/guildSetup";
// sub-commands for creating,editing and deleting
export default {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription(
      "A command to setup the server with the TK History Record Management System"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  permissions: {
    authNeeded: true,
    rolesAllowed: [PermissionLevel.ServerAdmin],
  },
  properties: {
    cooldown: 15,
    enabled: true,
    deferReply: true,
    ephemeral: false,
  },
  execute: async (interaction) => {
    await interaction.editReply({
      content: "Setup has begun, please be patient :)",
    });
    guildSetup(interaction.client, interaction.guild!)
      .then(async () => {
        const successEmbed = new EmbedBuilder()
          .setTitle("Server Setup Completed")
          .setDescription(
            "Your server has been setup with the bot successfully. Now, you can setup the Admin Roles/Users, Set nickname rules, and create your Submissions and Feedback channels!"
          )
          .setColor("Green");
        await interaction.editReply({
          embeds: [successEmbed],
        });
      })
      .catch(async (error) => {
        const errorEmbed = new EmbedBuilder()
          .setTitle("Server Setup Failed")
          .setDescription(
            `Your server has not been setup with the bot, there was an error during setup that has prevented the bot from being setup. Please see the below message for more information:\n${error}`
          )
          .setColor("Red");
        await interaction.editReply({
          embeds: [errorEmbed],
        });
        return;
      });
  },
} satisfies Command;