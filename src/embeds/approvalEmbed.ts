import { Record } from "@prisma/client";
import baseEmbed from "./baseEmbed";
import client from "..";

const approvalEmbed = (recordData: Record) => {
  const _embed = baseEmbed()
    .setTitle("Record Approved")
    .setDescription(
      `${client.config.emojis.tick} ${
        recordData.submittedBy
      }> your record with ID ${recordData.id} and Title ${
        recordData.title
      } has been approved. Find it at **[Trello](${
        recordData.trelloLink
      })**\n### Approval Information \n **Approval Date:** <t:${Math.floor(
        recordData.lastUpdated.getTime() / 1000.0
      )}:f> \n**Approved By:** <@${recordData.approvedBy}>`
    );
  return _embed;
};
export { approvalEmbed };
export default approvalEmbed;
