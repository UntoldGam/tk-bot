import { REST, Routes } from "discord.js";
import config from "../config";

require("dotenv").config();

export default async function () {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  try {
    console.log("Clearing global commands...");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: [],
    });
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        config.main.tkDevServer
      ),
      {
        body: [],
      }
    );
    console.log("Cleared global commands!");
  } catch (err) {
    console.error(err);
    console.error("Failed to clear global commands!");
  }
}
