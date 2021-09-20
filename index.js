require('dotenv').config()
const express = require('express');
const {Telegraf}  = require('telegraf');

const app = express();
const bot = new Telegraf(process.env.TOKEN)
const PORT = process.env.PORT;

bot.start(ctx => {
  ctx.reply('Darima pussy')
})

bot.on('text', ctx => {
  ctx.reply('some text')
})

bot.on('voice', ctx => {
  console.log(ctx.update.message.voice);
  ctx.reply('some voice')
})

bot.launch();

app.listen(PORT, () => {
  console.log(`My server is running on port ${PORT}`);
})
