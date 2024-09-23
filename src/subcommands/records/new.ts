import {
  ActionRowBuilder,
  ButtonBuilder,
  InteractionResponse,
  Options,
  SlashCommandSubcommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { SubCommand } from "../../classes/index";
import { objectUtil, z } from "zod";
import { errorEmbed } from "../../embeds";
import { db } from "../../handlers/database";
import { Record } from "@prisma/client";
import { trello } from "../../handlers/trello";
import baseEmbed from "../../embeds/baseEmbed";
import { handleLabelSelection, sendApprovalRequest } from "../../handlers/submissions";
import { labelsMenu } from "../../selectMenus";
import { submitRecord } from "../../buttons";

const newRecord = {
  data: new SlashCommandSubcommandBuilder()
    .setName("new")
    .setDescription("Creates a new record on the History Trello")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title of the Record which is shown on the List")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The description/content of the Record")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("written-by")
        .setDescription("The username of the person who wrote the record")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("event-date")
        .setDescription("The date of the event that the record is about")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("author")
        .setDescription(
          "The person who wrote the record, this should be a Discord User ID. Defaults to command user."
        )
        .setRequired(false)
    ),
  execute: async (interaction) => {
    const _title = interaction.options.getString("title");
    const _description = interaction.options.getString("description");
    let _author = interaction.options.getString("author");
    if (_author == null || _author.length == 0) {
      _author = interaction.user.id;
    }
    const recordData = await db.record.create({
      data: {
        title: _title,
        description: _description,
        submittedBy: _author,
      },
    });

    handleLabelSelection(recordData, interaction);
    

    /*const confirmationEmbed = baseEmbed()
      .setTitle("Submission Created")
      .setDescription(
        `Your submission has been sent successfully, for any future references to your reocrd please use the following Id: \`${recordData.id}\`. This id makes it easier for HR to find your record through the Bot.`
      );
    sendApprovalRequest(recordData, interaction, "submission");
    interaction.editReply({
      embeds: [confirmationEmbed],
    });
	*/
  },
} satisfies SubCommand;

export default newRecord;
