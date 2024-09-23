import {
  Client,
  Guild,
  GuildInviteManager,
  PermissionFlagsBits,
  Role,
} from "discord.js";
import { db } from "./database";
import { AdminType } from "@prisma/client";
import config from "../config";

export default async (client: Client, guild: Guild) => {
  let guildAdminRoles = guild.roles.cache
    .filter(
      (role) =>
        role.permissions.has(PermissionFlagsBits.Administrator) &&
        role.managed == false
    )
    .mapValues((value) => value.id);
  const adminsForDB = [
    ...guildAdminRoles.map((id) => {
      return {
        type: AdminType.ROLE,
        id: id,
      };
    }),
    {
      type: AdminType.USER,
      id: guild.ownerId,
    },
    {
      type: AdminType.USER,
      id: config.main.owner,
    },
  ];
  const server = await db.server.upsert({
    create: {
      id: guild.id,
      admins: adminsForDB,
    },
    where: {
      id: guild.id,
    },
    update: {
      admins: adminsForDB,
    },
  });
  return server;
};
