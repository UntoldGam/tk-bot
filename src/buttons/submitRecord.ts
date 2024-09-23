import { ButtonBuilder, ButtonStyle } from "discord.js";
import client from "..";

const submitRecord = (buttonId: string) => {
  const _button = new ButtonBuilder()
    .setCustomId(`${buttonId}--submitRecord`)
    .setLabel("Submit")
    .setStyle(ButtonStyle.Success)
    .setEmoji(client.config.emojis.tick);
  return _button;
};
export { submitRecord };
export default submitRecord;
