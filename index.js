import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import {Telegraf}  from 'telegraf';
import { addTodo, deleteTask, getTodo } from './db.js';
import { confirmTask, getMenu, selectCurrency, selectTodo } from './keysboard.js';
const app = express();
const bot = new Telegraf(process.env.TOKEN)
const PORT = process.env.PORT;

let message = "";

bot.start(ctx => {
  ctx.reply('Darima pussy', getMenu())
})


// ЗАДАЧИ

bot.hears('Задачи', async ctx => {

  ctx.replyWithHTML(
    `<b>Чтобы добавить задачу введите текст ниже \n или выберите действие:</b>`,
    selectTodo()
  )

})


bot.action('getTask', async ctx => {
  const todo = await getTodo();
  let result = '';

  todo.forEach((t, i) => result+= result + `[${i+1}] ${t}\n`);

  ctx.replyWithHTML(
    '<b>Список ваших задач:</b>\n\n'+
    `${result == "" ? result = "На данный момент задач нет"  : result}`
  )
})

bot.action('deleteTask', async ctx => {

  const todo = await getTodo();
  let result = '';

  todo.forEach((t, i) => result+= result + `[${i+1}] ${t}\n`);

  ctx.replyWithHTML(
      'Введите фразу <i>"удалить `порядковый номер задачи`"</i>, чтобы удалить сообщение,'+
      'например, <b>"удалить 3"</b>:\n' +
      `${result == "" ? result = "На данный момент задач нет"  : result}`
  )
})

bot.hears(/^удалить\s(\d+)$/, ctx => {
  const id = Number(+/\d+/.exec(ctx.message.text)) - 1
  let status = deleteTask(id);
  ctx.reply(status);
})


bot.action(['yes', 'no'], ctx => {
  if (ctx.callbackQuery.data == 'yes'){
    let status = addTodo(message)
    ctx.editMessageText(status);
    confirmTask();
  } else {
    ctx.deleteMessage();
  }
})




// Валюты

bot.hears('Курсы валют', ctx => {

  ctx.replyWithHTML(
    `<b>Выберите валютуe:</b>`,
    selectCurrency()
  )

})

bot.action(/^currency/, async ctx => {

 const currency = ctx.match.input.split('-')[1].toUpperCase();

 const {data} = await axios(`http://api.currencylayer.com/live?access_key=${process.env.CURRENCY_TOKEN}&currencies=USD,EUR,RUB,BTC`)

 console.log(data.quotes)

 for (let key in data.quotes) {
   if(key.includes(currency)){
    return ctx.reply(data.quotes[key]);
   }
 }

})





// Прочее

bot.on('text', ctx => {

  message = ctx.message.text;

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
