import {
  ActionRowBuilder,
  AnySelectMenuInteraction,
  ButtonBuilder,
  ButtonInteraction,
  ChannelType,
  Collection,
  ComponentType,
  GuildMemberRoleManager,
  InteractionResponse,
  StringSelectMenuInteraction,
  TextChannel,
  ThreadChannel,
} from "discord.js";

import { DiscordClient } from "../../classes";
import { db } from "../../handlers/database";
import {
  approveRecord,
  sendApprovalRequest,
  updateRecord,
} from "../../handlers/submissions";
import { errorEmbed } from "../../embeds";
import { AdminType } from "@prisma/client";
import { changeRequestModal, editRecordModal } from "../../modals";
import baseEmbed from "../../embeds/baseEmbed";
import { labelsMenu } from "../../selectMenus";
import { trello } from "../../handlers/trello";
import { submitRecord } from "../../buttons";

const menuHandler = async (
  client: DiscordClient,
  interaction: AnySelectMenuInteraction
) => {
  try {
    const userId = interaction.member.user.id;
    const memberRoles = interaction.member.roles as GuildMemberRoleManager;
    if (interaction.isStringSelectMenu())
      interaction = interaction as StringSelectMenuInteraction;
    const menuId = interaction.customId;
    const split = menuId.split("--");
    const recordId = split[0];
    const menuType = split[1];
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
    const isAdminUser = server.admins.find(
      (admin) =>
        admin.type == AdminType.USER && admin.id.toString() == userId.toString()
    );
    const hasAdminRole = server.admins.find(
      (admin) =>
        admin.type == AdminType.ROLE &&
        memberRoles.cache.find((role) => role.id == admin.id)
    );

    if (!server) return;
    if (userId != recordData.submittedBy || !isAdminUser || !hasAdminRole)
      return;
    switch (menuType) {
      case "labelsMenu":
        if (recordData) {
          recordData = await db.record.update({
            where: {
              id: recordData.id,
            },
            data: {
              labels: [...recordData.labels, ...interaction.values],
            },
          });
          /* let currentLabels: String[] = [];
          recordData.labels.forEach((label) => {
            const _labelName = trello.labels.find(
              (_label) => _label.id == label
            ).name;
            currentLabels.push(_labelName);
          });
          const confirmationEmbed = baseEmbed()
            .setTitle("Labels Updated")
            .setDescription(
              `Your current labels are ${currentLabels.join(
                ", "
              )}. \nPress "Submit" to send your submission for approval, or simply dismiss this message to add more labels.`
            );
          interaction.followUp({
            embeds: [confirmationEmbed],
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                submitRecord(recordData.id)
              ),
            ],
          }); */
        }
        break;
      default:
        interaction.reply({
          content: `No menu found that matches the given Id: ${menuId}`,
        });

        break;
    }
  } catch (err) {
    client.logError(err);
  }
};

export default menuHandler;
export { menuHandler };
