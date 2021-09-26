import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import {Telegraf}  from 'telegraf';
import { addTodo, deleteTask, getTodo } from './db.js';
import { confirmTask, getMenu, selectCity, selectCurrency, selectTodo } from './keysboard.js';
const app = express();
const bot = new Telegraf(process.env.TOKEN)
const PORT = process.env.PORT;

let message = "";
let currencies;


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
    `<b>Выберите валюту:</b>`,
    selectCurrency()
  )

})

bot.action(/^currency/, async ctx => {

 const currency = ctx.match.input.split('-')[1].toUpperCase();

 if (!currencies){
   const {data} = await axios(process.env.CURRENCY_URL)
   currencies = data.Valute;
 }

  if (!currencies[currency]){
    return ctx.reply(`Не получается найти валюту ${currency}`);
  }
  return ctx.reply(currencies[currency].Value);

})


// Погода

bot.hears('Погода', ctx => {
  ctx.replyWithHTML(
    `<b>Выберите город из списка или введите вручную:</b>`,
    selectCity()
  )
})


bot.action(/^weather/, async ctx => {

  const city = ctx.match.input.split('-')[1];

  const {data} = await axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY}`);
  return ctx.replyWithHTML(`
  <b>Актуальная погода по городу ${data.name}</b>\n
  <b>Температура: </b><i>${Math.round(data.main.temp - 273)} ℃</i>
  <b>Ощущается как: </b><i>${Math.round(data.main.feels_like - 273)} ℃</i>
  <b>Давление: </b><i>${data.main.pressure * 0.75}</i>
  <b>Влажность: </b><i>${data.main.humidity} г.м</i>
  <b>Видимость: </b><i>${data.visibility} м</i>
  <b>Ветер: </b><i>${data.wind.speed} м.с</i>
  <b>Рассвет: </b><i>${new Date(data.sys.sunrise).getHours()}ч. ${new Date(data.sys.sunrise).getMinutes()}м.</i>
  <b>Закат: </b><i>${new Date(data.sys.sunset).getHours()}ч. ${new Date(data.sys.sunset).getMinutes()}м.</i>`
  )
 })


 //WIKI


// Прочее

bot.on('text', ctx => {

  message = ctx.message.text

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
