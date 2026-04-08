import { saveTasks, loadTasks } from "./storage.js";
import { displayList } from "./ui.js";

const openModalButton = document.getElementById("openModalButton");
const closeModalButton = document.querySelector(".closeModalButton");
const addButton = document.getElementById("addButton"); // переменная для кнокпи добавления задачи
const tasksList = document.querySelector(".to-do-list");
const addModal = document.querySelector(".add-modal");
const editModal = document.querySelector(".edit-modal");
const deleteButton = document.querySelector("#deleteButton");

let myTasks = loadTasks(); //загружает в массив данные из бд
// newTask — это объект (одна карточка), а myTasks — это массив (стопка карточек)
displayList(myTasks); //отрисвка уже имеющихся задач

openModalButton.onclick = function () {
  //функция открытия модалки с добавлением задачи
  switchingClassForAddModal();
};

closeModalButton.onclick = function () {
  //функция закрытия модалки
  switchingClassForAddModal();
};

function switchingClassForAddModal() {
  tasksList.classList.toggle("hidden");
  addModal.classList.toggle("hidden"); //переключение класса у модалки
  openModalButton.classList.toggle("hidden");
}

function switchingClassForEditModal() {
  tasksList.classList.toggle("hidden");
  editModal.classList.toggle("hidden"); //переключение класса у модалки
  openModalButton.classList.toggle("hidden");
}

addButton.onclick = function (event) {
  // событие по клику на кнопку
  event.preventDefault(); // запрет на обновление страницы при нажатии на кнопку добавить
  let taskName = document.getElementById("taskName").value.trim(); // получение и обрезка лишних пустых симовлов из инпута
  let deadline = document.getElementById("deadline").value;
  let category = document.getElementById("category").value;

  if (!taskName) {
    alert("Enter a task");
    return;
  } else if (!deadline) {
    alert("Enter a deadline");
    return;
  } else if (!category) {
    alert("Choose a category");
    return;
  } // проверка на пустой инпут

  // let now = new Date(); //создание переменной в которую записывается дата текущая
  const newTask = {
    // объект новой задачи
    id: crypto.randomUUID(), // генерация ID
    taskName,
    category,
    deadline,
    // year: now.getFullYear(), // добавление именно года, месяца, даты и дня (строки ниже)
    // month: now.getMonth(),
    // date: now.getDate(),
    // day: now.getDay(),
    isDone: false, // задача не выполнена по умолчанию
  };

  myTasks.push(newTask); // добавление новой задачи в наш массив
  saveTasks(myTasks); // сохранение объекта

  document.getElementById("taskName").value = ""; // очистка полей
  document.getElementById("deadline").value = "";
  document.getElementById("category").value = "";

  displayList(myTasks);
  switchingClassForAddModal();
};

tasksList.onclick = function (event) {
  const target = event.target; // ловим куда реально кликнули
  const taskItem = target.closest(".to-do-item");
  const checkbox = target.closest(".checkbox");

  if (checkbox) {
    const taskID = checkbox.dataset.id;

    // поиск задачи по чекбоксу которой кликнули
    let foundTask = myTasks.find((task) => task.id === taskID);

    // проверка на пустое значение
    if (foundTask) {
      foundTask.isDone = !foundTask.isDone; // переключение статуса при клике
    }

    saveTasks(myTasks);
    displayList(myTasks);

    return
  } 
   if (taskItem) {
    const taskID = taskItem.dataset.id;
    
    deleteButton.dataset.id = taskID;
    switchingClassForEditModal();
  }
};

function deleteTask(tasks, id) {
  // если id который был передан не соответствует id объкта то оставляем
  return tasks.filter((task) => task.id !== id);
}

deleteButton.onclick = function () {
  const taskID = this.dataset.id; //получаем id задачи из кнопки

  if (taskID) {
    myTasks = deleteTask(myTasks, taskID);
    saveTasks(myTasks);
    displayList(myTasks);

    // Закрываем модалку после удаления
    switchingClassForEditModal();
  }
};
