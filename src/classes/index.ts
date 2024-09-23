//import Command from "./Command";
import config, { trello } from "../config";
import Event from "./Event";
import ExtendedClient from "./ExtendedClient";
import * as Sentry from "@sentry/node";

import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  RESTPatchAPIApplicationCommandJSONBody,
  RESTPutAPIApplicationCommandsJSONBody,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  Snowflake,
  ThreadAutoArchiveDuration,
} from "discord.js";

class DiscordClient extends Client {
  //commands: Collection<string, Command>;
  public commandIds: Collection<string, Snowflake>;
  public commands: Collection<string, Command>;
  public config: typeof config;
  public events: Collection<string, any>;
  public logCommandError: Function;
  public logError: Function;
  public sentry: typeof Sentry;
  public validPermissions: string[];
  constructor(opts: any) {
    super(opts);
  }
}

export interface Command {
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandSubcommandGroupBuilder;
  permissions: {
    authNeeded: boolean;
    rolesAllowed: PermissionLevel[];
  };
  properties: {
    cooldown: Number;
    enabled: boolean;
    deferReply: boolean;
    ephemeral: boolean;
  };
  execute: (interaction: ChatInputCommandInteraction) => void;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
}

export interface SubCommand {
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandSubcommandGroupBuilder
    | SlashCommandSubcommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
}

export enum ErrorID {
  NoGuild = "No Discord Guild was found",
  NoUser = "No Discord User was found",
  NoMember = "No Discord Member was found",
  NoBotGuild = "No Server was found in the Bot's Database",
  Other = "An error occured, ask a developer for more information",
  MissingPermission = "You are missing the PERMISSION_LEVEL Permission Level that is required to perform this action.",
}

export interface AuthResponse {
  authorised: boolean;
  errorId?: ErrorID;
}

export enum PermissionLevel {
  RoleLock = "Role Lock",
  BotAdmin = "Bot Admin",
  ServerAdmin = "Server Admin",
  ServerOwner = "Server Owner",
  BotOwner = "Bot Owner",
}

export { ExtendedClient, DiscordClient, Event };

export default {
  Event,
  ExtendedClient,
  DiscordClient,
};
