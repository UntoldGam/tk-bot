import { Snowflake } from "discord.js";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
      CLIENT_ID: Snowflake;
      GUILD_ID: string;
      MONGODB_URL: string;
      DEV_MONGODB_URL: string;
      SENTRY_DSN: string;
      TRELLO_TOKEN: string;
      TRELLO_KEY: string;
      NODE_ENV: string;
    }
  }
}
export {};
