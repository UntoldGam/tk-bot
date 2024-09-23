import { Record } from "@prisma/client";
import {
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
  EmbedBuilder,
} from "discord.js";
import client from "..";

const errorEmbed = (error: string) => {
  const _embed = new EmbedBuilder()
    .setTitle("An Error Occured")
    .setDescription(`Here is your error: \n${error}`)
    .setColor(client.config.embeds.error)
    .setFooter({
      text: "Created by UntoldGam",
      iconURL: client.config.main.logoUrl,
    })
    .setTimestamp();
  return _embed;
};
export { errorEmbed };
export default errorEmbed;
