import {
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
} from "discord.js";

const changeRequestModal = (modalId: string): ModalBuilder => {
  const _modal = new ModalBuilder().setCustomId(modalId).setTitle("Feedback");
  const firstAR = new ActionRowBuilder<TextInputBuilder>().addComponents(
    new TextInputBuilder()
      .setCustomId(`${modalId}--changeSummary`)
      .setLabel("Provide a summary of the changes")
      .setPlaceholder("e.g. Spelling mistakes")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
  );
  const secondAR = new ActionRowBuilder<TextInputBuilder>().addComponents(
    new TextInputBuilder()
      .setCustomId(`${modalId}--fullChangeDescription`)
      .setLabel("Provide details of the changes")
      .setPlaceholder("e.g. Change ... to ...")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
  );
  _modal.addComponents(firstAR, secondAR);
  return _modal;
};
export { changeRequestModal };
export default changeRequestModal;
