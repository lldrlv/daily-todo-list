import { saveTasks, loadTasks } from "./storage.js";
import { displayList } from "./ui.js";

const addButton = document.getElementById("addButton"); // переменная для кнокпи добавления задачи
const tasksList = document.querySelector(".to-do-list");

let myTasks = loadTasks(); //загружает в массив данные из бд
// newTask — это объект (одна карточка), а myTasks — это массив (стопка карточек)
displayList(myTasks); //отрисвка уже имеющихся задач

addButton.onclick = function (event) {
  // событие по клику на кнопку
  event.preventDefault(); // запрет на обновление страницы при нажатии на кнопку добавить
  let taskName = document.getElementById("taskName").value.trim(); // получение и обрезка лишних пустых симовлов из инпута
  if (!taskName) return; // проверка на пустой инпут

  let now = new Date(); //создание переменной в которую записывается дата текущая
  const newTask = {
    // объект новой задачи
    id: crypto.randomUUID(), // генерация ID
    taskName,
    year: now.getFullYear(), // добавление именно года, месяца, даты и дня (строки ниже)
    month: now.getMonth(),
    date: now.getDate(),
    day: now.getDay(),
    isDone: false, // задача не выполнена по умолчанию
  };

  myTasks.push(newTask); // добавление новой задачи в наш массив
  saveTasks(myTasks); // сохранение объекта

  document.getElementById("taskName").value = ""; // очистка инпута
  displayList(myTasks);
  // временная проверка
  console.log(myTasks);
};

tasksList.onclick = function (event) {
  const target = event.target; // ловим куда реально кликнули

  // ищет снизу вверх первый элемент с нужным классом
  const deleteButton = target.closest(".delete-button");

  if (deleteButton) {
    // если нашел
    const taskID = deleteButton.dataset.id; //получаем id задачи из кнопки

    //перезаписываем в массив отфильтрованные (без удаленного элемента) объекты
    myTasks = deleteTask(myTasks, taskID);
    saveTasks(myTasks); // сохраняем
    displayList(myTasks); // отрисовываем
    return; // выход из функции
  }
};

function deleteTask(tasks, id) {
  // если id который был передан не соответствует id объкта то оставляем
  return tasks.filter((task) => task.id !== id);
}
