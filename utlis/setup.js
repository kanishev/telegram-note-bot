import dotenv from "dotenv";
import { getMenu } from "./keysboard.js";
dotenv.config();

import { Telegraf } from "telegraf";
const bot = new Telegraf("2045189952:AAFMpL8CA2IA5SAJF7yuK2DsM43r00RhXGw");

bot.start((ctx) => {
  ctx.reply("Добро пожаловать", getMenu());
});

export default bot;
