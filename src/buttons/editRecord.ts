import {
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import client from "..";

const editRecord = (buttonId: string) => {
  const _button = new ButtonBuilder()
    .setCustomId(`${buttonId}--editRecord`)
    .setLabel("Edit Record")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(client.config.emojis.edit);
  return _button;
};
export { editRecord };
export default editRecord;
