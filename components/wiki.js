import dotenv from "dotenv";
import bot from "../utlis/setup.js";
import state from "../index.js";
dotenv.config();

export function wiki() {
  bot.hears("Поиск wiki", (ctx) => {
    state.status = "wiki";
    return ctx.reply("Введите запрос");
  });
}

export async function fetchWiki(message) {
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
