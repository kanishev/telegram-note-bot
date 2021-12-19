import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import bot from "../utlis/setup.js";
import state from "../index.js";
import { selectCurrency } from "../utlis/keysboard.js";

let currencyList = null;

export default function currencies() {
  bot.hears("Курсы валют", (ctx) => {
    state.status = "currency";
    ctx.replyWithHTML(`<b>Выберите валюту:</b>`, selectCurrency());
  });

  bot.action(/^currency/, async (ctx) => {
    const currency = ctx.match.input.split("-")[1].toUpperCase();

    if (!currencyList) {
      const { data } = await axios(process.env.CURRENCY_URL);
      currencyList = data.Valute;
    }

    if (!currencyList[currency]) {
      return ctx.reply(`Не получается найти валюту ${currency}`);
    }
    return ctx.reply(currencyList[currency].Value);
  });
}
