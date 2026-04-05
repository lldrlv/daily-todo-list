const DB_NAME = "myTasks"; //создание бд

export function saveTasks(task) {
  let taskString = JSON.stringify(task); //преобразование объекта в строку
  localStorage.setItem(DB_NAME, taskString); //добавление полученной строки в бд
}

export function loadTasks() {
  let data = localStorage.getItem(DB_NAME); //получение данных из бд
  if (!data) return []; //проверка на пустые данные
  return JSON.parse(data); //возврат преобразованного в объект значения
}
