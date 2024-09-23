import ExtendedClient from "../classes/ExtendedClient";

import Discord, {
  ButtonInteraction,
  ChatInputCommandInteraction,
  CommandInteraction,
  Interaction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import fs from "fs";
import { DiscordClient } from "../classes";
import trelloInit from "../handlers/trello";

export async function getDirs(path: string) {
  return (await fs.promises.readdir(path, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export async function loadHandlers(client: DiscordClient) {
  const handlers = fs
    .readdirSync("./dist/handlers")
    .filter((file: String) => file.endsWith(".js"));
  trelloInit().then(async () => {
    for (const file of ["command", "event"]) {
      (await import(`../handlers/${file}`)).default(client, Discord);
    }
  });
}

// Ensures that errors due to already replied interactions and/or deferred interactions are minimsed to reduce bot crashes or interaction hang-ups
export const safeInteractionReply = async (
  replyData: any,
  interaction:
    | ChatInputCommandInteraction
    | ModalSubmitInteraction
    | ButtonInteraction
    | StringSelectMenuInteraction
    | CommandInteraction
) => {
  if (interaction.replied) {
    interaction.followUp(replyData);
  } else {
    interaction.deferred
      ? interaction.editReply(replyData)
      : interaction.reply(replyData);
  }
};
