import { ButtonBuilder, ButtonStyle } from "discord.js";
import client from "..";

const addNote = (buttonId: string) => {
  const _button = new ButtonBuilder()
    .setCustomId(`${buttonId}--addNote`)
    .setLabel("Add Note")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(client.config.emojis.info);
  return _button;
};
export { addNote };
export default addNote;
