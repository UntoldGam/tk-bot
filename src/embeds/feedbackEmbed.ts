import { Record } from "@prisma/client";
import {
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
} from "discord.js";
import client from "..";
import baseEmbed from "./baseEmbed";
import { editRecord } from "../buttons";

const feedbackEmbed = (
  changeSummary: string,
  fullChangeDescription: string,
  recordData: Record
) => {
  const _embed = baseEmbed()
    .setTitle("Submission Change Request")
    .setDescription(
      `${client.config.emojis.notification} <@${
        recordData.submittedBy
      }> you've been asked to make some changes to your sumbission. \n### Your Submission \n **Title:** ${
        recordData.title
      }\n **Original Submission Date:** <t:${Math.floor(
        recordData.dateSubmitted.getTime() / 1000.0
      )}:f> \n**Submission Id:** ${
        recordData.id
      } \n### Requested Changes \n**Summary:** ${changeSummary}\n **Details:** ${fullChangeDescription}\n\n Please be aware that when you submit the form shown by the "Edit Record" Button, this will re-submit your Record for approval. It is recommended to discuss and gain help to correct your Submission in a thread by pressing "Create Support Thread" `
    );
  return _embed;
};
export { feedbackEmbed };
export default feedbackEmbed;
