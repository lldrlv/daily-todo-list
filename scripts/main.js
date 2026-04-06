import { saveTasks, loadTasks } from "./storage.js";
import { displayList } from "./ui.js";

const addButton = document.getElementById("addButton"); // переменная для кнокпи добавления задачи

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
