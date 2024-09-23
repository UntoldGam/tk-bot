import { Record } from "@prisma/client";
import { EmbedBuilder } from "discord.js";
import baseEmbed from "./baseEmbed";
import client from "..";

const submissionEmbed = (recordData: Record, isResubmission: boolean) => {
  const _embed = baseEmbed()
    .setTitle(`Record ${isResubmission ? "Resubmission" : "Submission"}`)
    .setDescription(
      `${client.config.emojis.notification} <@${
        recordData.submittedBy
      }> has sent a ${
        isResubmission ? "resubmission" : "submission"
      }. Please read through it, and provide a response by pressing either "Approve" or "Request Changes". \nIf they don\'t work, use the commands: \`/record approve\` or \`/record deny\` \n### Submission Information \n **Title:** ${
        recordData.title
      }\n **Description:** ${
        recordData.description
      }\n **Submission Date:** <t:${Math.floor(
        recordData.dateSubmitted.getTime() / 1000.0
      )}:f> \n**Submission Id:** ${recordData.id}`
    );
  return _embed;
};
export { submissionEmbed };
export default submissionEmbed;
