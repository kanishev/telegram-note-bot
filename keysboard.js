import { Markup } from "telegraf";

export function getMenu(){
  return Markup.keyboard([
    ['Все задачи', 'Добавить задачу']
  ]).resize();
}

export function confirmTask(){
  return Markup.inlineKeyboard([
    Markup.button.callback('Да', 'yes'),
    Markup.button.callback('Нет', 'no')
], {columns: 2});
}
