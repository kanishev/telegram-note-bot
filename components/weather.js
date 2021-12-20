import dotenv from "dotenv";
import bot from "../utlis/setup.js";
import state from "../index.js";
import { selectCity } from "../utlis/keysboard.js";
import axios from "axios";
dotenv.config();

export async function fetchWeather(city) {
  const { data } = await axios(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=410a19818d6e23811129ab0eded2fe74`
  );
  return data;
}

export function weather() {
  bot.hears("Погода", (ctx) => {
    state.status = "weather";

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
}
