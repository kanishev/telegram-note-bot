import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import {Telegraf}  from 'telegraf';
import { confirmTask, getMenu } from './keysboard.js';

const app = express();
const bot = new Telegraf(process.env.TOKEN)
const PORT = process.env.PORT;

bot.start(ctx => {
  ctx.reply('Darima pussy', getMenu())
})

bot.hears('Все задачи', ctx => {
  ctx.reply('Тут будут ваши задачи')
})

bot.hears('Добавить задачу', ctx => {
  ctx.reply('Тут вы сможете добавить свои задачи')
})

bot.command('time', ctx => {
  ctx.reply(String(new Date()))
})

bot.on('text', ctx => {
  ctx.replyWithHTML(
      `Вы действительно хотите добавить задачу:\n\n`+
      `<i>${ctx.message.text}</i>`,
      confirmTask()
  )
})

bot.launch();

app.listen(PORT, () => {
  console.log(`My server is running on port ${PORT}`);
})
