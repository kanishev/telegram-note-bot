import express from "express";
import bot from "./utlis/setup.js";
import currencies from "./components/currencies.js";
import todo from "./components/todo.js";
import { wiki } from "./components/wiki.js";
import { weather } from "./components/weather.js";
import listeners from "./utlis/listetners.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Bot");
});

const state = {
  status: "",
};

export default state;

todo();
currencies();
wiki();
weather();
listeners();

bot.launch();

app.listen(3000, () => {
  console.log(`My server is running on port 3000`);
});
