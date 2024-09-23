import {
  ButtonInteraction,
  ChannelType,
  Collection,
  ComponentType,
  GuildMemberRoleManager,
  InteractionResponse,
  TextChannel,
  ThreadChannel,
} from "discord.js";

import { DiscordClient } from "../../classes";
import { db } from "../../handlers/database";
import { approveRecord, sendApprovalRequest, updateRecord } from "../../handlers/submissions";
import { errorEmbed } from "../../embeds";
import { AdminType } from "@prisma/client";
import { changeRequestModal, editRecordModal } from "../../modals";
import baseEmbed from "../../embeds/baseEmbed";

const buttonHandler = async (
  client: DiscordClient,
  interaction: ButtonInteraction
) => {
  try {
    const buttonId = interaction.customId;
    const split = buttonId.split("--");
    const recordId = split[0];
    const buttonType = split[1];
    const server = await db.server.findUnique({
      where: {
        id: interaction.guildId,
      },
    });
    let recordData = await db.record.findUnique({
      where: {
        id: recordId,
      },
    });
    if (!server) return;
    switch (buttonType) {
      case "approveRequest":
        if (
          recordData &&
          recordData.trelloLink == null &&
          interaction.isRepliable()
        ) {
          const userId = interaction.member.user.id;
          const memberRoles = interaction.member
            .roles as GuildMemberRoleManager;
          const isAdminUser = server.admins.find(
            (admin) =>
              admin.type == AdminType.USER &&
              admin.id.toString() == userId.toString()
          );
          const hasAdminRole = server.admins.find(
            (admin) =>
              admin.type == AdminType.ROLE &&
              memberRoles.cache.find((role) => role.id == admin.id)
          );
          if (isAdminUser || hasAdminRole) {
            await approveRecord(
              recordData,
              interaction.member.user.id,
              interaction
            );
          } else {
            interaction.reply({
              embeds: [
                errorEmbed("Only a High Rank can interact with this button."),
              ],
            });
          }
        }
        if (interaction.replied) {
          interaction.editReply({
            components: [],
          });
        }
        break;
      case "createSupportThread":
        let feedbackChannel = client.channels.cache.find(
          (channel) => channel.id == server.feedbackChannel
        );
        if (feedbackChannel.isTextBased()) {
          feedbackChannel = feedbackChannel as TextChannel;
          await feedbackChannel.threads.create({
            name: `${interaction.member.user.username} - Support Thread`,
            startMessage: `Hello, feel free to ping an Archivist+ to gain some support on your Submission's Change Request.\nArchivists and above are able to see and provide support with this Thread.`,
            type: ChannelType.PrivateThread,
          });
        }
        break;
      case "editRecord":
        if (
          recordData &&
          recordData.trelloLink == null &&
          interaction.isRepliable()
        ) {
          const _feedbackModal = editRecordModal(
            `${recordData.id}--feedbackModal`,
            recordData.title,
            recordData.description
          );
          interaction.showModal(_feedbackModal);
        }
        interaction.editReply({
          components: [],
        });
        break;
      case "requestChanges":
        if (
          recordData &&
          recordData.trelloLink == null &&
          interaction.isRepliable()
        ) {
          // check if it exists and if it has not been approved
          const _changeRequestModal = changeRequestModal(
            `${recordData.id}--changeRequestModal`
          );
          9;
          interaction.showModal(_changeRequestModal);
        }
        interaction.editReply({
          components: [],
        });
        break;
      case "submitRecord":
        const confirmationEmbed = baseEmbed()
          .setTitle("Submission Created")
          .setDescription(
            `Your submission has been sent successfully, for any future references to your record please use the following Id: \`${recordData.id}\`. This id makes it easier for HR to find your record through the Bot.`
          );
        sendApprovalRequest(recordData, interaction, "submission");
       
       
        interaction.editReply({
          embeds: [confirmationEmbed],
        });
        break;
      default:
        interaction.reply({
          content: `No button found that matches the given Id: ${buttonId}`,
        });

        break;
    }
  } catch (err) {
    client.logError(err);
  }
};

export default buttonHandler;
export { buttonHandler };
