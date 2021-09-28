import axios from "axios";
import dotenv from "dotenv";
import e from "express";
dotenv.config();

import express from "express";
import { Telegraf } from "telegraf";
import { addTodo, deleteTask, getTodo } from "./db.js";
import {
  confirmTask,
  getMenu,
  selectCity,
  selectCurrency,
  selectTodo,
} from "./keysboard.js";

const app = express();
const bot = new Telegraf(process.env.TOKEN);
const PORT = process.env.PORT;

let message = "";
let status = "empty";
let currencies;

bot.start((ctx) => {
  ctx.reply("Добро пожаловать", getMenu());
});

// ЗАДАЧИ

bot.hears("Задачи", async (ctx) => {
  status = "todo";

  ctx.replyWithHTML(
    `<b>Чтобы добавить задачу введите текст ниже \n или выберите действие:</b>`,
    selectTodo()
  );
});

bot.action("getTask", async (ctx) => {
  const todo = await getTodo();
  let result = "";

  todo.forEach((t, i) => (result += result + `[${i + 1}] ${t}\n`));

  ctx.replyWithHTML(
    "<b>Список ваших задач:</b>\n\n" +
      `${result == "" ? (result = "На данный момент задач нет") : result}`
  );
});

bot.action("deleteTask", async (ctx) => {
  const todo = await getTodo();
  let result = "";

  todo.forEach((t, i) => (result += result + `[${i + 1}] ${t}\n`));

  ctx.replyWithHTML(
    'Введите фразу <i>"удалить `порядковый номер задачи`"</i>, чтобы удалить сообщение,' +
      'например, <b>"удалить 3"</b>:\n' +
      `${result == "" ? (result = "На данный момент задач нет") : result}`
  );
});

bot.hears(/^удалить\s(\d+)$/, (ctx) => {
  const id = Number(+/\d+/.exec(ctx.message.text)) - 1;
  let status = deleteTask(id);
  ctx.reply(status);
});

bot.action(["yes", "no"], (ctx) => {
  if (ctx.callbackQuery.data == "yes") {
    let status = addTodo(message);
    ctx.editMessageText(status);
    ctx.replyWithHTML(
      `<b>Чтобы добавить задачу введите текст ниже \n или выберите действие:</b>`,
      selectTodo()
    );
  } else {
    ctx.deleteMessage();
    ctx.replyWithHTML(
      `<b>Чтобы добавить задачу введите текст ниже \n или выберите действие:</b>`,
      selectTodo()
    );
  }
});

// Валюты

bot.hears("Курсы валют", (ctx) => {
  status = "currency";

  ctx.replyWithHTML(`<b>Выберите валюту:</b>`, selectCurrency());
});

bot.action(/^currency/, async (ctx) => {
  const currency = ctx.match.input.split("-")[1].toUpperCase();

  if (!currencies) {
    const { data } = await axios(process.env.CURRENCY_URL);
    currencies = data.Valute;
  }

  if (!currencies[currency]) {
    return ctx.reply(`Не получается найти валюту ${currency}`);
  }
  return ctx.reply(currencies[currency].Value);
});

// Погода
bot.hears("Погода", (ctx) => {
  status = "weather";

  ctx.replyWithHTML(
    `<b>Выберите город из списка или введите вручную:</b>`,
    selectCity()
  );
});

bot.action(/^weather/, async (ctx) => {
  const city = ctx.match.input.split("-")[1];
  let data = await fetchWeather(city);

  return ctx.replyWithHTML(`
  <b>Актуальная погода по городу ${data.name}</b>\n
  <b>Температура: </b><i>${Math.round(data.main.temp - 273)} ℃</i>
  <b>Ощущается как: </b><i>${Math.round(data.main.feels_like - 273)} ℃</i>
  <b>Давление: </b><i>${data.main.pressure * 0.75}</i>
  <b>Влажность: </b><i>${data.main.humidity} г.м</i>
  <b>Видимость: </b><i>${data.visibility} м</i>
  <b>Ветер: </b><i>${data.wind.speed} м.с</i>
  <b>Рассвет: </b><i>${new Date(data.sys.sunrise).getHours()}ч. ${new Date(
    data.sys.sunrise
  ).getMinutes()}м.</i>
  <b>Закат: </b><i>${new Date(data.sys.sunset).getHours()}ч. ${new Date(
    data.sys.sunset
  ).getMinutes()}м.</i>`);
});

async function fetchWeather(city) {
  const { data } = await axios(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY}`
  );
  return data;
}

//WIKI

bot.hears("Поиск wiki", (ctx) => {
  status = "wiki";
  return ctx.reply("Введите запрос");
});

async function fetchWiki() {
  const wiki_url = process.env.WIKI_URL;
  const params = {
    origin: "*",
    format: "json",
    action: "query",
    prop: "pageimages|extracts",
    exchars: 500,
    exintro: true,
    explaintext: true,
    generator: "search",
    gsrlimit: 1,
    gsrsearch: message,
    pithumbsize: 300,
  };

  const { data } = await axios.get(wiki_url, { params });
  return data;
}

// Прочее

bot.on("text", async (ctx) => {
  message = ctx.message.text;

  if (status == "todo") {
    ctx.replyWithHTML(
      `Вы действительно хотите добавить задачу:\n\n` +
        `<i>${ctx.message.text}</i>`,
      confirmTask()
    );
  } else if (status == "wiki") {
    fetchWiki();
    const data = await fetchWiki();

    const pages = data.query.pages;

    for (let key in pages) {
      await ctx.reply(pages[key].title);
      if (pages[key].thumbnail.source)
        await ctx.replyWithPhoto(pages[key].thumbnail.source);
      await ctx.reply(pages[key].extract);
      await ctx.reply(
        `Читать статью полностью - \n https://ru.wikipedia.org/?curid=${key}`
      );
    }
  } else if (status == "empty") {
    ctx.reply("Сначала выберите раздел");
  } else if (status == "weather") {
    try {
      const data = await fetchWeather(message);
      return ctx.replyWithHTML(`
      <b>Актуальная погода по городу ${data.name}</b>\n
      <b>Температура: </b><i>${Math.round(data.main.temp - 273)} ℃</i>
      <b>Ощущается как: </b><i>${Math.round(data.main.feels_like - 273)} ℃</i>
      <b>Давление: </b><i>${data.main.pressure * 0.75}</i>
      <b>Влажность: </b><i>${data.main.humidity} г.м</i>
      <b>Видимость: </b><i>${data.visibility} м</i>
      <b>Ветер: </b><i>${data.wind.speed} м.с</i>
      <b>Рассвет: </b><i>${new Date(data.sys.sunrise).getHours()}ч. ${new Date(
        data.sys.sunrise
      ).getMinutes()}м.</i>
      <b>Закат: </b><i>${new Date(data.sys.sunset).getHours()}ч. ${new Date(
        data.sys.sunset
      ).getMinutes()}м.</i>`);
    } catch (e) {
      console.log(e);
    }
  }
});

bot.launch();

app.listen(PORT, () => {
  console.log(`My server is running on port ${PORT}`);
});
