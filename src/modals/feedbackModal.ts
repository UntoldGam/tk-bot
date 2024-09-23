import {
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
} from "discord.js";

const editRecordModal = (
  modalId: string,
  recordTitle: string,
  recordDescription: string
): ModalBuilder => {
  const _modal = new ModalBuilder().setCustomId(modalId).setTitle("Edit Your Record");
  const firstAR = new ActionRowBuilder<TextInputBuilder>().addComponents(
    new TextInputBuilder()
      .setCustomId(`${modalId}--recordTitle`)
      .setLabel("Make the requested changes (title)")
      .setValue(recordTitle)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
  );
  const secondAR = new ActionRowBuilder<TextInputBuilder>().addComponents(
    new TextInputBuilder()
      .setCustomId(`${modalId}--recordDescription`)
      .setLabel("Make the requested changes (description)")
      .setValue(recordDescription)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
  );
  _modal.addComponents(firstAR, secondAR);
  return _modal;
};
export { editRecordModal };
export default editRecordModal;
