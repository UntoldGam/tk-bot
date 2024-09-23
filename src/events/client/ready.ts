import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";

import Discord from "discord.js";
import { exec } from "child_process";
import globalCommands from "../../scripts/global-deploy";
import { DiscordClient } from "../../classes";
import { env } from "process";

const event: Event = {
  name: "ready",
  once: true,
  async execute(client: DiscordClient) {
    try {
      // Login Message
      console.log(`Logged in as: ${client.user?.tag}`);
      console.log(process.env.NODE_ENV);
      if (process.env.NODE_ENV == "development") {
          // Register Commands
          await globalCommands(true);
      }

      // Automatic Git Pull
      /* setInterval(() => {
                exec("git pull", (err: any, stdout: any) => {
                    if(err) return console.log(err);
                    if(stdout.includes("Already up to date.")) return;

                    console.log(stdout);
                    process.exit();
                })
            }, 30 * 1000) */ // 30 seconds
    } catch (err) {
      client.logError(err);
    }
  },
};

export = event;
