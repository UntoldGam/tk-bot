import { ButtonBuilder, ButtonStyle } from "discord.js";
import client from "..";

const createSupportThread = (buttonId: string) => {
  const _button = new ButtonBuilder()
    .setCustomId(`${buttonId}--createSupportThread`)
    .setLabel("Create Support Thread")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(client.config.emojis.ticket);
  return _button;
};
export { createSupportThread };
export default createSupportThread;
