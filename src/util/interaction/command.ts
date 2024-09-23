import client from "../../index";
import { Command } from "../../classes/index";

import { emojis as emoji, main } from "../../config";
import { Collection, EmbedBuilder, CommandInteraction, ChatInputCommandInteraction } from "discord.js";

const cooldowns = new Map();

export = async (interaction: CommandInteraction) => {
  try {
    const command: Command = client.commands.get(interaction.commandName);

    if (!command) return;

    if (!command.properties.enabled) {
      const disabled = new EmbedBuilder()
        .setColor(client.config.embeds.error)
        .setDescription(`${emoji.cross} This command has been disabled!`);

      await interaction.reply({ embeds: [disabled], ephemeral: true });
      return;
    }

    const validPermissions = client.validPermissions;

  /*   if (command.botPermissions.length) {
      const invalidPerms = [];

      for (const perm of command.botPermissions as any) {
        if (!validPermissions.includes(perm)) return;

        if (!interaction.guild.members.me.permissions.has(perm))
          invalidPerms.push(perm);
      }

      if (invalidPerms.length) {
        const permError = new EmbedBuilder()
          .setColor(client.config.embeds.error)
          .setDescription(
            `I am missing these permissions: \`${invalidPerms.join("`, `")}\``
          );

        await interaction.reply({ embeds: [permError], ephemeral: true });
        return;
      }
    } */

    command.properties.deferReply
      ? command.properties.ephemeral
        ? await interaction.deferReply({ ephemeral: true })
        : await interaction.deferReply()
      : null;

    if (interaction.user.id === main.owner) {
      // Log interaction to console
      console.log(
        `[interactionCreate] [command] ${interaction.user.tag} (${
          interaction.user.id
        }): /${interaction.commandName} ${interaction.options.data
          .map((option: any) =>
            option.value ? `${option.name}:${option.value}` : option.name
          )
          .join(" ")}`
      );

      try {
        await command.execute(interaction as ChatInputCommandInteraction);
        return;
      } catch (err) {
        client.logError(err);

        const error = new EmbedBuilder()
          .setColor(client.config.embeds.error)
          .setDescription(
            `${emoji.cross} There was an error while executing that command!`
          );

        command.properties.deferReply
          ? await interaction.editReply({ embeds: [error] })
          : await interaction.reply({ embeds: [error], ephemeral: true });
        return;
      }
    }

    if (!cooldowns.has(command.data.name))
      cooldowns.set(command.data.name, new Collection());

    const currentTime = Date.now();
    const timeStamps = cooldowns.get(command.data.name);
    const cooldownAmount = (command.properties.cooldown as number) * 1000;

    if (timeStamps.has(interaction.user.id)) {
      const expirationTime =
        timeStamps.get(interaction.user.id) + cooldownAmount;

      if (currentTime < expirationTime) {
        const timeLeft: string = ((expirationTime - currentTime) / 1000)
          .toFixed(0)
          .toString();

        const cooldown = new EmbedBuilder()
          .setColor(client.config.embeds.error)
          .setDescription(
            `⏰ Please wait ${timeLeft} second${
              timeLeft === "1" ? "" : "s"
            } before running that command again!`
          );

        command.properties.deferReply
          ? await interaction.editReply({ embeds: [cooldown] })
          : await interaction.reply({ embeds: [cooldown], ephemeral: true });
        return;
      }
    }

    timeStamps.set(interaction.user.id, currentTime);

    setTimeout(() => {
      timeStamps.delete(interaction.user.id);
    }, cooldownAmount);

    try {
      // Log interaction to console
      console.log(
        `[interactionCreate] [command] ${interaction.user.tag} (${
          interaction.user.id
        }): /${interaction.commandName} ${interaction.options.data
          .map((option: any) =>
            option.value ? `${option.name}:${option.value}` : option.name
          )
          .join(" ")}`
      );

      await command.execute(interaction as ChatInputCommandInteraction);
    } catch (err) {
      client.logError(err);

      const error = new EmbedBuilder()
        .setColor(client.config.embeds.error)
        .setDescription(
          `${emoji.cross} There was an error while executing that command!`
        );

      command.properties.deferReply
        ? await interaction.editReply({ embeds: [error] })
        : await interaction.reply({ embeds: [error], ephemeral: true });
    }
  } catch (err) {
    client.logError(err);
  }
};
