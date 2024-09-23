import ExtendedClient from "../../classes/ExtendedClient";
import { AutocompleteInteraction } from "discord.js";

import Command from "../../classes/Command";
import { DiscordClient } from "../../classes";

export = async (client: DiscordClient, interaction: AutocompleteInteraction) => {
    try {
        const command = client.commands.get(interaction.commandName);

        if(!command) return;

        try {
            // Log interaction to console
            console.log(`[interactionCreate] [autocomplete] ${interaction.user.tag} (${interaction.user.id}): /${interaction.commandName} ${interaction.options.getFocused(true).name}${interaction.options.getFocused(true).value ? `:${interaction.options.getFocused(true).value}` : ""}`);

            await command.autocomplete(interaction);
        } catch(err) {
            client.logError(err);
        }
    } catch(err) {
        client.logError(err);
    }
}
