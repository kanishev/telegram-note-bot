import dotenv from "dotenv";
import bot from "../utlis/setup.js";
import state from "../index.js";
import { selectTodo } from "../utlis/keysboard.js";
import { getTodo, deleteTask, addTodo } from "../utlis/db.js";
dotenv.config();

export default function todo() {
  bot.hears("Задачи", async (ctx) => {
    state.status = "todo";

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
      let status = addTodo(state.message);
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
}
