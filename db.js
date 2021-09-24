const todoList = [];

export function addTodo(todo){

  if(!todoList.includes(todo)){
    todoList.push(todo);
    return 'Задача успешно добавлена';
  }
  return 'Задача уже добавлена';

}

export function getTodo() {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve(todoList)
      }, 500)
  })
}

export function deleteTask(id) {
  if(todoList[id]){
    todoList.splice(id, 1)
    return 'Задача успешно удалена';
  }
  return 'Такой задачи нет';
}
