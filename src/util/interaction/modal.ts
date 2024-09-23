import {
  ActionRowBuilder,
  ButtonBuilder,
  ModalSubmitInteraction,
} from "discord.js";

import { DiscordClient } from "../../classes";
import { db } from "../../handlers/database";
import { feedbackEmbed } from "../../embeds";
import {
  approveRequest,
  createSupportThread,
  editRecord,
  requestChanges,
} from "../../buttons";
import { updateRecord } from "../../handlers/submissions";
import { Record } from "@prisma/client";

const modalHandler = async (
  client: DiscordClient,
  interaction: ModalSubmitInteraction
) => {
  try {
    const modalId = interaction.customId;
    const split = modalId.split("--");
    const recordId = split[0];
    const modalType = split[1];
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
    switch (modalType) {
      case "changeRequestModal":
        const changeSummary = interaction.fields.getTextInputValue(
          `${modalId}--changeSummary`
        );
        const fullChangeDescription = interaction.fields.getTextInputValue(
          `${modalId}--fullChangeDescription`
        );
        const changeRequestEmbed = feedbackEmbed(
          changeSummary,
          fullChangeDescription,
          recordData
        );
        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          editRecord(recordData.id),
          createSupportThread(recordData.id)
        );
        const feedbackChannel = client.channels.cache.find(
          (channel) => channel.id == server.feedbackChannel
        );
        if (feedbackChannel.isTextBased()) {
          feedbackChannel.send({
            embeds: [changeRequestEmbed],
            components: [actionRow],
          });
        }
        (await interaction.deferUpdate({})).edit({
          components: [],
        });
        interaction.followUp({
          content: "Feedback has been sent to the feedback channel.",
          ephemeral: true,
        });
        break;
      case "feedbackModal":
        const newTitle = interaction.fields.getTextInputValue(
          `${modalId}--recordTitle`
        );
        const newDescription = interaction.fields.getTextInputValue(
          `${modalId}--recordDescription`
        );
        const updated = {
          title: newTitle,
          description: newDescription,
        } as Record;
        await updateRecord(
          recordData.id,
          {
            title: newTitle,
            description: newDescription,
          },
          interaction
        );
        (await interaction.deferUpdate({})).edit({
          components: [],
        });
        interaction.followUp({
          content: "Record has been edited and re-sent for approval.",
          
        });
        break;
	case "submissionModal":
		const _title = interaction.fields.getTextInputValue(`${modalId}--recordTitle`);
		const _description = interaction.fields.getTextInputValue(`${modalId}--recordDescription`);
		
		
      default:
        interaction.reply({
          content: `No modal found that matches the given Id: ${modalId}`,
        });
        break;
    }
  } catch (err) {
    client.logError(err);
  }
};

export default modalHandler;
export { modalHandler };
