import { DiscordClient } from "./classes";
import config from "./config";
import "./handlers/database";
require("dotenv").config();

import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

import Discord from "discord.js";

const client = new DiscordClient({
  intents: ["Guilds", "GuildMessages"],
  presence: {
    activities: [
      {
        name: "to your submissions",
        type: Discord.ActivityType.Listening,
      },
    ],
    status: "online",
  },
});
// Config
client.config = config;

// Error Handling
process.on("unhandledRejection", (err: Error) => Sentry.captureException(err));

// Handlers
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

import { loadHandlers } from "./util/functions";
loadHandlers(client);

// Login
client.login(process.env.DISCORD_TOKEN);

// Constants
client.commandIds = new Discord.Collection();
client.sentry = Sentry;

client.validPermissions = [
  "CreateInstantInvite",
  "KickMembers",
  "BanMembers",
  "Administrator",
  "ManageChannels",
  "ManageGuild",
  "AddReactions",
  "ViewAuditLog",
  "PrioritySpeaker",
  "Stream",
  "ViewChannel",
  "SendMessages",
  "SendTTSMessages",
  "ManageMessages",
  "EmbedLinks",
  "AttachFiles",
  "ReadMessageHistory",
  "MentionEveryone",
  "UseExternalEmojis",
  "ViewGuildInsights",
  "Connect",
  "Speak",
  "MuteMembers",
  "DeafenMembers",
  "MoveMembers",
  "UseVAD",
  "ChangeNickname",
  "ManageNicknames",
  "ManageRoles",
  "ManageWebhooks",
  "ManageEmojisAndStickers",
  "UseApplicationCommands",
  "RequestToSpeak",
  "ManageEvents",
  "ManageThreads",
  "CreatePublicThreads",
  "CreatePrivateThreads",
  "UseExternalStickers",
  "SendMessagesInThreads",
  "UseEmbeddedActivities",
  "ModerateMembers",
  "ViewCreatorMonetizationAnalytics",
  "UseSoundboard",
  "SendVoiceMessages",
  "SendPolls",
  "UseExternalApps",
];

export default client;
