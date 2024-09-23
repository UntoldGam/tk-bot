import { Record } from "@prisma/client";
import { trello } from "./trello";
import { db } from "./database";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import client from "..";
import { approvalEmbed, submissionEmbed } from "../embeds";
import {
  approveRequest,
  requestChanges,
  submitRecord,
  cancelRecord as btnCancelRecord,
} from "../buttons";
import baseEmbed from "../embeds/baseEmbed";
import { labelsMenu } from "../selectMenus";
import { safeInteractionReply } from "../util/functions";

const handleLabelSelection = async (
  recordData: Record,
  interaction: ButtonInteraction | ChatInputCommandInteraction
) => {
  const labelSelectionEmbed = baseEmbed()
    .setTitle("Choose your labels")
    .setDescription(
      'In order for you to have a card on the trello, it must have a label. Please use the select menu attached to add the correct labels to your record. \nYou can select multiple.\nWhen you\'ve finished selecting labels, press "Submit"'
    );
  safeInteractionReply(
    {
      embeds: [labelSelectionEmbed],
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          labelsMenu(`${recordData.id}`, trello.labels)
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          submitRecord(recordData.id),
          btnCancelRecord(recordData.id)
        ),
      ],
    },
    interaction
  );
};

const sendApprovalRequest = async (
  recordData: Record,
  interaction:
    | ButtonInteraction
    | ChatInputCommandInteraction
    | ModalSubmitInteraction
    | StringSelectMenuInteraction,
  stageOfSubmission: string
) => {
  const _submissionEmbed = submissionEmbed(
    recordData,
    stageOfSubmission.includes("change")
  );
  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    approveRequest(recordData.id),
    requestChanges(recordData.id)
  );
  const server = await db.server.findUnique({
    where: {
      id: interaction.guildId,
    },
  });
  const submissionsChannel = client.channels.cache.find(
    (channel) => channel.id == server.submissionsChannel
  );
  if (submissionsChannel.isTextBased()) {
    const message = await submissionsChannel.send({
      embeds: [_submissionEmbed],
      components: [actionRow],
    });
    await db.record.update({
      where: {
        id: recordData.id,
      },
      data: {
        messageIds: [
          ...recordData.messageIds,
          {
            messageId: message.id,
            submissionStage: stageOfSubmission,
          },
        ],
      },
    });
  }
};

const updateRecord = async (
  recordId: string,
  recordData: Partial<Record>,
  interaction:
    | ButtonInteraction
    | ChatInputCommandInteraction
    | ModalSubmitInteraction
) => {
  recordData = await db.record.update({
    where: {
      id: recordId,
    },
    data: recordData,
  });
  let newSubmissionStage;
  const submissionStages = recordData.messageIds.map(
    (msg) => msg.submissionStage
  );
  if (submissionStages.includes("change")) {
    const changes = submissionStages.map((stage) => stage.includes("change"));
    const numberOfChanges = changes.length;
    newSubmissionStage = `change-${numberOfChanges + 1}`;
  } else {
    newSubmissionStage = "change-1";
  }
  await sendApprovalRequest(
    recordData as Record,
    interaction,
    newSubmissionStage
  );
};

const approveRecord = async (
  recordData: Record,
  approvedById: string,
  interaction:
    | StringSelectMenuInteraction
    | ButtonInteraction
    | ChatInputCommandInteraction
) => {
  const recordCard = await trello.createCard(recordData);
  if (!recordCard) {
    interaction.reply("Error creating Trello Card");
    return;
  }
  const updatedRecord = await db.record.update({
    where: {
      id: recordData.id,
    },
    data: {
      approvedBy: approvedById,
      trelloLink: recordCard.shortUrl,
    },
  });
  safeInteractionReply(
    {
      embeds: [approvalEmbed(updatedRecord)],
    },
    interaction
  );
};

const cancelRecord = async (
  recordData: Record,
  interaction: ButtonInteraction | ChatInputCommandInteraction
) => {
  const _record = await db.record.delete({
    where: {
      id: recordData.id,
    },
  });

  const deletionConfirmation = baseEmbed()
    .setTitle("Cancellation Successfull")
    .setDescription(
      `The Record with ID \"${recordData.id}\" and Title \"${recordData.title}\" has been successfully cancelled and deleted from our Storage.\nThis action is final, once cancelled, there is nothing we can't restore it.`
    );

  safeInteractionReply(
    {
      embeds: [deletionConfirmation],
    },
    interaction
  );
};

export {
  sendApprovalRequest,
  approveRecord,
  cancelRecord,
  updateRecord,
  handleLabelSelection,
};
