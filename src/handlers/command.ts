import ExtendedClient from "../classes/ExtendedClient";
import { CommandInteraction, EmbedBuilder } from "discord.js";

import fs from "fs";
import { getDirs, safeInteractionReply } from "../util/functions";
import { DiscordClient } from "../classes";
import { emojis } from "../config";

export = async (client: DiscordClient) => {
  async function loadRoot() {
    const files = fs
      .readdirSync(`./dist/commands`)
      .filter((file: String) => file.endsWith(".js"));

    for (const file of files) {
      const command = (await import(`../commands/${file}`)).default;
      if (command.data) {
        client.commands.set(command.data.name, command);

        console.log(`Loaded Command: ${command.data.name}`);
      }
    }
  }

  async function loadDir(dir: String) {
    const files = fs
      .readdirSync(`./dist/commands/${dir}`)
      .filter((file: String) => file.endsWith(".js"));

    for (const file of files) {
      const command = (await import(`../commands/${dir}/${file}`)).default;

      if (command.data) {
        client.commands.set(command.data.name, command);

        console.log(`Loaded Command: ${command.data.name}`);
      }
    }
  }

  await loadRoot();
  (await getDirs("./dist/commands")).forEach((dir: String) => loadDir(dir));

  client.logCommandError = async function (
    err: Error,
    interaction: CommandInteraction
  ) {
    const id = client.sentry.captureException(err);
    console.error(err);

    const error = new EmbedBuilder()
      .setColor(client.config.embeds.error)
      .setTitle(`${emojis.cross} An error occurred`)
      .setDescription(`\`\`\`${err.message}\`\`\``)
      .addFields({ name: "Error ID", value: id })
      .setTimestamp();
    safeInteractionReply({ embeds: [error] }, interaction);
  };

  require("dotenv").config();
};
