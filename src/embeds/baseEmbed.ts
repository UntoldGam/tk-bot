import { Record } from "@prisma/client";
import {
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
  EmbedBuilder,
} from "discord.js";
import client from "..";

const baseEmbed = () => {
  const _embed = new EmbedBuilder()
    .setColor(client.config.embeds.default)
    .setFooter({
      text: "Created by UntoldGam",
      iconURL: client.config.main.logoUrl,
    })
    .setTimestamp();
  return _embed;
};
export { baseEmbed };
export default baseEmbed;
