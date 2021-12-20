import dotenv from "dotenv";
import bot from "./setup.js";
import state from "../index.js";
import { confirmTask } from "./keysboard.js";
import { fetchWiki } from "../components/wiki.js";
import { fetchWeather } from "../components/weather.js";

dotenv.config();

export default function listeners() {
  bot.on("text", async (ctx) => {
    let message = ctx.message.text;
    state.message = ctx.message.text;

    if (state.status == "todo") {
      ctx.replyWithHTML(
        `Вы действительно хотите добавить задачу:\n\n` + `<i>${message}</i>`,
        confirmTask()
      );
    }
    if (state.status == "wiki") {
      try {
        fetchWiki(message);
        const data = await fetchWiki(message);

        const pages = data.query.pages;

        for (let key in pages) {
          await ctx.reply(pages[key].title);

          if (pages[key].extract) {
            await ctx.reply(pages[key].extract);
          }

          if (pages[key].thumbnail) {
            await ctx.replyWithPhoto(pages[key].thumbnail.source);
            await ctx.reply(pages[key].extract);
            await ctx.reply(
              `Читать статью полностью - \n https://ru.wikipedia.org/?curid=${key}`
            );
          }
        }
      } catch (e) {
        await ctx.reply("Похоже, данных с таким запросом не найдено");
      }
    }

    if (state.status == "empty") {
      ctx.reply("Сначала выберите раздел");
    } else if (state.status == "weather") {
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
        <b>Рассвет: </b><i>${new Date(
          data.sys.sunrise
        ).getHours()}ч. ${new Date(data.sys.sunrise).getMinutes()}м.</i>
        <b>Закат: </b><i>${new Date(data.sys.sunset).getHours()}ч. ${new Date(
          data.sys.sunset
        ).getMinutes()}м.</i>`);
      } catch (e) {
        console.log(e);
        await ctx.reply("Похоже, данных на ваш запрос не нашлось");
      }
    }
  });
}
