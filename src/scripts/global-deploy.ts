import { REST, Routes } from "discord.js";

import fs from "fs";
import { getDirs } from "../util/functions";
import { Command, DiscordClient } from "../classes";
import clearCommands from "./clear-commands";
require("dotenv").config();
let _client: DiscordClient;
export default async function (useClient: boolean) {
  const commands: any[] = [];
  if (useClient) {
    _client = (await import("..")).default;
  }
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  try {
    console.log("Registering global commands...");
    // Push Slash Commands
    await pushRoot();
    await pushDirs();
    const applicationCommands: any = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands.map((cmd) => cmd) }
    );
    if (useClient) {
      for (const command of applicationCommands) {
        _client.commandIds.set(command.name, command.id);
        _client.commands.get(command.name).data = command;
      }
    };
    console.log("Registered global commands!");
  } catch (err) {
    if (useClient) {
      _client.sentry.captureException(err);
    }
    console.error(err);
    console.error("Failed to register global commands!");
  }
  // Slash Commands
  async function pushRoot() {
    const files = fs
      .readdirSync(`./dist/commands`)
      .filter((file) => file.endsWith(".js"));

    for (const file of files) {
      //const command: Command = require(`../commands/${file}`);
      const command: Command = (await import(`../commands/${file}`)).default;
      //   console.log(command);
      if (command.properties.enabled) {
        commands.push(command);
      } else {
        console.log(`Command ${command.data.name} is disabled`);
      }
    }
  }

  async function pushDirs() {
    const dirs = await getDirs("./dist/commands");

    for (let iDir = 0; iDir < dirs.length; iDir++) {
      const dir = dirs[iDir];
      const files = fs
        .readdirSync(`./dist/commands/${dir}`)
        .filter((file) => file.endsWith(".js"));

      for (const file of files) {
        const command: Command = (await import(`../commands/${dir}/${file}`))
          .default;
        if (command.properties.enabled) {
          commands.push(command.data.toJSON());
          if (useClient) _client.commands.set(command.data.name, command);
        } else {
          console.log(`Command ${command.data.name} is disabled`);
        }
      }
    }
  }
}
