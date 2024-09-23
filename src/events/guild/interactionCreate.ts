import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";
import { Interaction, PermissionResolvable } from "discord.js";

import autocompleteHandler from "../../util/interaction/autocomplete";
import commandHandler from "../../util/interaction/command";
import { DiscordClient } from "../../classes";
import { buttonHandler } from "../../util/interaction/button";
import { modalHandler } from "../../util/interaction/modal";

const event: Event = {
  name: "interactionCreate",
  once: false,
  async execute(
    client: DiscordClient,
    Discord: typeof import("discord.js"),
    interaction: Interaction
  ) {
    try {
      const requiredPerms: PermissionResolvable = [
        "SendMessages",
        "EmbedLinks",
      ];

      // Ignore interactions not in a guild
      if (!interaction.guild) return;
      // Ignore interactions if the bot does not have the required permissions
      if (!interaction.guild.members.me?.permissions.has(requiredPerms)) return;

      // Autocomplete handler
      if (interaction.isAutocomplete())
        return await autocompleteHandler(client, interaction);
      // Command handler
      if (
        interaction.isCommand() &&
        !interaction.isMessageContextMenuCommand() &&
        !interaction.isUserContextMenuCommand()
      )
        return await commandHandler(interaction);
      if (interaction.isButton()) {
        return await buttonHandler(client, interaction);
      }
      if (interaction.isModalSubmit()) {
        return await modalHandler(client, interaction);
      }
    } catch (err) {
      client.logError(err);
    }
  },
};

export = event;
