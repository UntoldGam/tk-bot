// check if user is authenticated to use the command

import {
  ChatInputCommandInteraction,
  GuildMember,
  PermissionFlagsBits,
  User,
} from "discord.js";
import { PermissionLevel, AuthResponse, ErrorID, Command } from "../classes";
import { db } from "./database";
import { Admin, AdminType, RoleLock } from "@prisma/client";
const reasonString = (permissionLvl: PermissionLevel): string => {
  return `User is a ${
    permissionLvl ? permissionLvl : "ERROR - NO PERMISSION LEVEL GIVEN"
  }`;
};

async function checkPermission(
  interaction: ChatInputCommandInteraction,
  command: Command
): Promise<AuthResponse | boolean | undefined> {
  if (!interaction.guild)
    return { authorised: false, errorId: ErrorID.NoGuild };
  const user: User = await interaction.user;
  if (!user) return { authorised: false, errorId: ErrorID.NoUser };

  const member = (await interaction.guild.members.cache.get(
    user.id
  )) as GuildMember;
  if (!member) return { authorised: false, errorId: ErrorID.NoMember };

  const rolesAllowed = command.permissions.rolesAllowed;
  const memberIsOwner = user.id === interaction.guild.ownerId;
  if (!db) return { authorised: false, errorId: ErrorID.Other };

  const guild = await db.server?.findUnique({
    where: {
      id: interaction.guildId || "0",
    },
  });

  if (memberIsOwner) return { authorised: true };
  if (rolesAllowed.includes(PermissionLevel.ServerOwner)) {
    return memberIsOwner;
  } else if (rolesAllowed.includes(PermissionLevel.ServerAdmin)) {
    if (member.permissions.has(PermissionFlagsBits.Administrator)) {
      return { authorised: true };
    }
  }

  if (!guild) return { authorised: false, errorId: ErrorID.NoBotGuild };
  if (rolesAllowed.includes(PermissionLevel.BotAdmin)) {
    guild.admins.forEach((admin: Admin) => {
      if (admin.type == AdminType.USER) {
        if (admin.id == user.id) return { authorised: true };
      } else if (admin.type == AdminType.ROLE) {
        if (member.roles.cache.has(admin.id)) return { authorised: true };
      }
    });
  }

  if (rolesAllowed.includes(PermissionLevel.RoleLock)) {
    const roleLock = guild.commandRoleLocks.find((roleLock: RoleLock) => {
      roleLock.commandName == command.data.name;
    });
    if (member.roles.cache.has(roleLock.roleRequired)) {
      return { authorised: true };
    }
  }
  return { authorised: false, errorId: ErrorID.Other };
}

export default checkPermission;
