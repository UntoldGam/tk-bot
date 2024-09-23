import { Command, SubCommand } from "../../classes/";
import { emojis } from "../../config";
import fs from "fs";
import { getDirs } from "../../util/functions";

import {
  EmbedBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from "discord.js";
import client from "../..";
import { sign } from "crypto";
import baseEmbed from "../../embeds/baseEmbed";

export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays a list of all my commands.")
    .addStringOption((opt) =>
      opt.setName("command").setDescription("Get info on a specific command.")
    )
    .addMentionableOption((opt) => {
      return opt
        .setName("cmd-test")
        .setDescription("Get info on a specific command");
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  permissions: {
    authNeeded: false,
    rolesAllowed: [],
  },
  properties: {
    cooldown: 5,
    enabled: true,
    deferReply: true,
    ephemeral: false,
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    try {
      const cmd: any = interaction.options.get("command")?.value;

      const commands: string[] = [];

      async function pushDirs() {
        const dirs = await getDirs("./dist/commands");

        for (let iDir = 0; iDir < dirs.length; iDir++) {
          const dir = dirs[iDir];
          const files = fs
            .readdirSync(`./dist/commands/${dir}`)
            .filter((file) => file.endsWith(".js"));

          for (const file of files) {
            const command: Command = (await import(`../${dir}/${file}`))
              .default;
            if (!command.properties.enabled) continue;
            commands.push(command.data.name);
          }
        }
      }
      await pushDirs();
      const cmds = [];
      for (const cmd of commands) {
        if (fs.existsSync(`./dist/subcommands/${cmd}`)) {
          // loop through subcommands in that dir
          const files = fs
            .readdirSync(`./dist/subcommands/${cmd}`)
            .filter((file) => file.endsWith(".js"));

          for (const file of files) {
            if (file == "index.js") continue;
            const subcommand: SubCommand = (
              await import(`../../subcommands/${cmd}/${file}`)
            ).default;
            cmds.push(
              `</${cmd} ${subcommand.data.name}:${client.commandIds.get(
                cmd
              )}> - ${subcommand.data.description}`
            );
          }
        } else {
          const info: Command = client.commands.get(cmd);
          cmds.push(
            `</${cmd}:${client.commandIds.get(cmd)}> - ${info.data.description}`
          );
        }

        // </name:id>
      }

      const help = baseEmbed()
        .setThumbnail(
          client.user.displayAvatarURL({ extension: "png", forceStatic: false })
        )
        .setTitle("Commands")
        .setDescription(cmds.join("\n"))
        .setTimestamp();

      const command: Command = client.commands.get(cmd);

      if (command) {
        if (!command.properties.enabled)
          return await interaction.editReply({ embeds: [help] });

        const description = command.data.description ?? "N/A";
        const cooldown = command.properties.cooldown
          ? `${command.properties.cooldown} second${
              command.properties.cooldown === 1 ? "" : "s"
            }`
          : "None";

        const commandHelp = new EmbedBuilder()
          .setColor(client.config.embeds.default)
          .setTitle(`Command: ${command.data.name}`)
          .addFields(
            { name: "Description", value: description },
            { name: "Cooldown", value: cooldown }
          )
          .setTimestamp();

        await interaction.editReply({ embeds: [commandHelp] });
        return;
      }

      await interaction.editReply({ embeds: [help] });
    } catch (err) {
      client.logCommandError(err, interaction);
    }
  },
} satisfies Command;
