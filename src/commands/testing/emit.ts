// @ts-ignore
// @ts-nocheck
import { Command } from "../../classes/";
import { Record } from "@prisma/client";

import {
  ActionRowBuilder,
  ButtonBuilder,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Interaction,
  ModalBuilder,
  Options,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import client from "../..";
import { changeRequestModal, feedbackModal } from "../../modals";
import feedbackEmbed from "../../embeds/feedbackEmbed";
import submissionEmbed from "../../embeds/submissionEmbed";
import {
  approveRequest,
  createSupportThread,
  editRecord,
  requestChanges,
} from "../../buttons";
import { sep } from "path";

const bot = require("../../../package.json");

export default {
  data: new SlashCommandBuilder()
    .setName("emit")
    .setDescription(
      "Creates a modal/button/embed to see if it works as it should using fake record data"
    )
    .addBooleanOption((option) =>
      option
        .setName("separate-channel")
        .setDescription(
          "Choose whether the embed should be sent to a different channel"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("modal")
        .setDescription("Choose what modal should be added to a test button")
        .setRequired(false)
        .addChoices(
          {
            name: "feedbackModal",
            value: "feedbackModal",
          },
          {
            name: "changeRequestModal",
            value: "changeRequestModal",
          }
        )
    )
    .addStringOption((option) =>
      option
        .setName("embed")
        .setDescription("Choose what embed should be sent")
        .setRequired(false)
        .addChoices(
          {
            name: "feedbackEmbed",
            value: "feedbackEmbed",
          },
          {
            name: "submissionEmbed",
            value: "submissionEmbed",
          }
        )
    ),
  permissions: {
    authNeeded: false,
    rolesAllowed: [],
  },
  properties: {
    cooldown: 5,
    enabled: false,
    deferReply: true,
    ephemeral: false,
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    try {
      const modal = interaction.options.get("modal")?.value.toString();
      const embed = interaction.options.get("embed")?.value.toString();
      const separateChannel =
        interaction.options.getBoolean("separate-channel");
      let _modal: ModalBuilder;
      let _embed: EmbedBuilder;
      const actionRow = new ActionRowBuilder<ButtonBuilder>();
      if (embed?.length > 0) {
        switch (embed) {
          case "feedbackEmbed":
            _embed = feedbackEmbed(
              "Spelling Changes",
              "Change ... to ... and x to y with z to w",
              {
                id: "1",
                title: "TEST",
                description: "TEST DESCRIPTION",
                dateSubmitted: new Date(),
                submittedBy: interaction.user.id,
                messageIds: [
                  {
                    messageId: "1273307281194356818",
                    submissionStage: "submission",
                  },
                ],
                lastUpdated: new Date(),
                trelloLink:
                  "https://trello.com/b/47PPkbjV/eo-history-of-the-air-nation",
                approvedBy: client.config.main.owner,
                labels: [],
              }
            );
            actionRow.addComponents(editRecord("1"));
            actionRow.addComponents(approveRequest("1"));
            actionRow.addComponents(requestChanges("1"));

            if (separateChannel) {
              let channel = client.channels.cache.get("1271958000034250825");
              if (channel.isTextBased()) {
                const msg = (await channel.messages.fetch()).find(
                  (message) => message.id == "1273307281194356818"
                );

                msg.reply({
                  embeds: [_embed],
                  components: [actionRow],
                });
              }
            } else {
              interaction.editReply({
                embeds: [_embed],
                components: [actionRow],
              });
            }

            break;
          case "submissionEmbed":
            _embed = submissionEmbed({
              id: "1",
              title: "TEST",
              description: "TEST DESCRIPTION",
              dateSubmitted: new Date(),
              submittedBy: interaction.user.id,
              messageIds: [],
              lastUpdated: new Date(),
              trelloLink: null,
              approvedBy: null,
              labels: [],
            });
            actionRow.addComponents(editRecord("1"));
            actionRow.addComponents(requestChanges("1"));
            actionRow.addComponents(createSupportThread("1"));

            break;
          default:
            break;
        }
      }
      if (modal?.length > 0) {
        switch (modal) {
          case "changeRequestModal":
            _modal = changeRequestModal(
              "cRM",
              "TEST TITLE",
              "TEST DESCRIPTION"
            );
            break;
          case "feedbackModal":
            _modal = feedbackModal("cRM", "TEST TITLE", "TEST DESCRIPTION");
            break;
          default:
            break;
        }
      }
    } catch (err) {
      client.logCommandError(err, interaction);
    }
  },
} satisfies Command;
