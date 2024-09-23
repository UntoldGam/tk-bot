import { EmbedBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { SubCommand } from "../../classes";
import { Admin, AdminType } from "@prisma/client";
import { embeds } from "../../config";
import { db } from "../../handlers/database";

const list = {
  data: new SlashCommandSubcommandBuilder()
    .setName("search")
    .setDescription("Lists all the current Admins (Roles and Users)"),
  execute: async (interaction) => {
    
  },
} satisfies SubCommand;

export default list;
