import { ButtonBuilder, ButtonStyle } from "discord.js";
import client from "..";

const approveRequest = (buttonId: string) => {
  const _button = new ButtonBuilder()
    .setCustomId(`${buttonId}--approveRequest`)
    .setLabel("Approve")
    .setStyle(ButtonStyle.Success)
    .setEmoji(client.config.emojis.tick);
  return _button;
};
export { approveRequest };
export default approveRequest;
