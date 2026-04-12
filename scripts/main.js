import { saveTasks, loadTasks } from "./storage.js";
import { displayList, displayGroupedTasks, renderDateStrip } from "./ui.js";

let currentSelectedDate = null;

const openModalButton = document.getElementById("openModalButton");
const closeAddModalButton = document.querySelector(".closeAddModalButton");
const closeEditModalButton = document.querySelector(".closeEditModalButton");
const addButton = document.getElementById("addButton"); // переменная для кнокпи добавления задачи
const deleteButton = document.querySelector("#deleteButton");
const saveButton = document.querySelector("#saveButton");

const datesLine = document.querySelector(".dates");

const filterSelect = document.querySelector("#filter");

const filter = document.querySelector(".filter");

const tasksList = document.querySelector(".to-do-list");

const addModal = document.querySelector(".add-modal");
const editModal = document.querySelector(".edit-modal");

let myTasks = loadTasks(); //загружает в массив данные из бд
// newTask — это объект (одна карточка), а myTasks — это массив (стопка карточек)

openModalButton.onclick = function () {
  //функция открытия модалки с добавлением задачи
  switchingClassForAddModal();
};

closeAddModalButton.onclick = function () {
  //функция закрытия модалки добавления
  switchingClassForAddModal();
};

closeEditModalButton.onclick = function () {
  //функция закрытия модалки редактирования
  switchingClassForEditModal();
};

function switchingClassForAddModal() {
  tasksList.classList.toggle("hidden");
  addModal.classList.toggle("hidden"); //переключение класса у модалки
  openModalButton.classList.toggle("hidden");
  filter.classList.toggle("hidden");
  datesLine.classList.toggle("hidden");
}

function switchingClassForEditModal() {
  tasksList.classList.toggle("hidden");
  editModal.classList.toggle("hidden"); //переключение класса у модалки
  openModalButton.classList.toggle("hidden");
  filter.classList.toggle("hidden");
  datesLine.classList.toggle("hidden");
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
  sortTasks(myTasks);

  document.getElementById("taskName").value = ""; // очистка полей
  document.getElementById("deadline").value = "";
  document.getElementById("category").value = "";

  displayList(myTasks);
  switchingClassForAddModal();
  updateInterface();
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
      const parentLi = checkbox.closest(".to-do-item");
      parentLi.classList.toggle("done");
    }
    sortTasks(myTasks);
    saveTasks(myTasks);
    updateInterface();

    return;
  }
  if (taskItem) {
    const taskID = taskItem.dataset.id;
    let foundTask = myTasks.find((task) => task.id === taskID);

    document.querySelector("#renameTask").value = foundTask.taskName;
    document.querySelector("#newDeadline").value = foundTask.deadline;
    document.querySelector("#editCategory").value = foundTask.category;

    deleteButton.dataset.id = taskID;
    saveButton.dataset.id = taskID;
    switchingClassForEditModal();
  }
};
deleteButton.onclick = function () {
  const taskID = this.dataset.id; //получаем id задачи из кнопки

  if (taskID) {
    myTasks = deleteTask(myTasks, taskID);
    saveTasks(myTasks);
    updateInterface();

    // Закрываем модалку после удаления
    switchingClassForEditModal();
  }
};

function deleteTask(tasks, id) {
  // если id который был передан не соответствует id объкта то оставляем
  return tasks.filter((task) => task.id !== id);
}

saveButton.onclick = function () {
  const id = this.dataset.id;
  const task = myTasks.find((task) => task.id == id);

  if (task) {
    const newNameTask = document.querySelector("#renameTask").value.trim();
    const newDeadline = document.querySelector("#newDeadline").value.trim();
    const newCategory = document.querySelector("#editCategory").value.trim();

    task.taskName = newNameTask;
    task.deadline = newDeadline;
    task.category = newCategory;

    saveTasks(myTasks);

    switchingClassForEditModal();
    updateInterface();
  }
};

filterSelect.onchange = updateInterface;

function updateInterface() {
  let value = filterSelect.value;

  // 1. Сначала фильтруем по дате (если она выбрана)
  let filtered = myTasks.filter((task) => {
    if (!currentSelectedDate) return true; // если дата не выбрана, берем все
    return task.deadline === currentSelectedDate;
  });

  // 2. Затем фильтруем то, что осталось, по статусу (All/Done/Active)
  filtered = filtered.filter((task) => {
    if (value === "allTasks" || value === "byCategory") return true;
    if (value === "completed") return task.isDone;
    if (value === "unfulfilled") return !task.isDone;
    return true;
  });

  // 3. Отрисовываем итоговый массив
  if (value === "byCategory") {
    displayGroupedTasks(filtered);
  } else {
    displayList(filtered);
  }
}

function sortTasks(myTasks) {
  myTasks.sort((a, b) => a.isDone - b.isDone);
}

function getDatesRange(today) {
  let arrayOfDays = [];

  for (let i = 0; i < 60; i++) {
    let date = new Date(today);
    date.setDate(date.getDate() + i);

    arrayOfDays.push(date);
  }

  return arrayOfDays;
}

function handleDateClick(selectedDate) {
  currentSelectedDate = selectedDate;
  updateInterface();
}

const week = getDatesRange(new Date());
renderDateStrip(week, handleDateClick);

const todayISO = new Date().toISOString().split("T")[0];
handleDateClick(todayISO);

// Используем setTimeout, чтобы DOM успел "понять", что кнопки созданы
setTimeout(() => {
  const todayBtn = document.querySelector(`[data-date="${todayISO}"]`);
  if (todayBtn) todayBtn.classList.add("isSelected");
}, 0);
