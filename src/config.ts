import { ColorResolvable } from "discord.js";

const embeds = {
  default: "#0096FF" as ColorResolvable,
  success: "#8ffa3e" as ColorResolvable,
  error: "#E74C3C" as ColorResolvable,
};

require("dotenv").config();

let emojis = {
  connection_bad: "<:poor_connection:1274380073671327785>",
  connection_good: "<:unstable_connection:1269057531175768095>",
  connection_excellent: "<:stable_connection:1269057514201157755>",
  cross: "<:negative:1274396552592494666>",
  tick: "<:positive:1274396516634853387>",
  edit: "<:edit:1276565773069979669>",
  ticket: "<:ticket:1274380455436877914>",
  settings: "<:settings:1274380487347146853>",
  notification: "<:notification:1274380508368732212>",
  info: "<:info:1274380546050621470>",
  delete: "<:delete:1274380582284951727>",
  ping: "<:ping:1274380589901807687>",
};

const main = {
  owner: "361210040331272193",
  logoUrl:
    "https://raw.githubusercontent.com/UntoldGam/tk-assets/cc9cfa017d79ec1a509c9e4c55426ec194d7e2c5/tk-bot-logo.png",
  tkDevServer: "1263162871148445788",
};

const trello = {
  apiURL: "https://api.trello.com/1",
  boardURL: "https://trello.com/b/47PPkbjV/eo-history-of-the-air-nation",
};

export { embeds, emojis, main, trello };

export default {
  embeds,
  emojis,
  main,
  trello,
};
