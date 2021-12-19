import dotenv from "dotenv";
import { getMenu } from "./keysboard.js";
dotenv.config();

import { Telegraf } from "telegraf";
const bot = new Telegraf(process.env.TOKEN);

bot.start((ctx) => {
  ctx.reply("Добро пожаловать", getMenu());
});

export default bot;
