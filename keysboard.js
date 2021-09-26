import { Markup } from "telegraf";

export function getMenu(){
  return Markup.keyboard([
    ['Задачи', 'Погода'],
    ['Поиск wiki', 'Курсы валют']
  ]).resize();
}

export function selectTodo(){
  return Markup.inlineKeyboard([
    Markup.button.callback('Посмотреть все', 'getTask'),
    Markup.button.callback('Удалить задачу', 'deleteTask'),
], {columns: 2});
}

export function selectCurrency(){
  return Markup.inlineKeyboard([
    Markup.button.callback('＄ - USD', 'currency-usd'),
    Markup.button.callback('€ - EUR', 'currency-eur'),
    Markup.button.callback('₴ - UAH' , 'currency-uah'),
    Markup.button.callback('₸ - KZT', 'currency-kzt'),
]);
}

export function selectCity(){
  return Markup.inlineKeyboard([
    Markup.button.callback('Москва', 'weather-moscow'),
    Markup.button.callback('Лондон', 'weather-london'),
    Markup.button.callback('Казань' , 'weather-kazan'),
    Markup.button.callback('Якутск', 'weather-yakutsk'),
]);
}

export function confirmTask(){
  return Markup.inlineKeyboard([
    Markup.button.callback('Да', 'yes'),
    Markup.button.callback('Нет', 'no'),
], {columns: 2});
}
