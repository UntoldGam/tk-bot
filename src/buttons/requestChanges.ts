import {
  ButtonBuilder,
  ButtonStyle,
  ComponentEmojiResolvable,
} from "discord.js";
import client from "..";

const requestChanges = (buttonId: string) => {
  const _button = new ButtonBuilder()
    .setCustomId(`${buttonId}--requestChanges`)
    .setLabel("Request Changes")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(client.config.emojis.edit);
  return _button;
};
export { requestChanges };
export default requestChanges;
