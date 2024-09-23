import { ButtonBuilder, ButtonStyle } from "discord.js";
import client from "..";

const cancelRecord = (buttonId: string) => {
  const _button = new ButtonBuilder()
    .setCustomId(`${buttonId}--cancelRecord`)
    .setLabel("Cancel Record")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(client.config.emojis.delete);
  return _button;
};
export { cancelRecord };
export default cancelRecord;
