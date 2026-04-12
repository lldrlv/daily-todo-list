import { saveTasks, loadTasks } from "./storage.js";
import {
  displayList, // отображение задач
  displayGroupedTasks, // отображение сгрупированных задач
  renderDateStrip, // оотображение ленты с датами
  getDateTitle, // отображение заголовка выбранного дня
} from "./ui.js";

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

const titleElement = document.getElementById("currentDateTitle");

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

// скрытие ненужных элементов при открытии окна добавления
function switchingClassForAddModal() {
  tasksList.classList.toggle("hidden");
  addModal.classList.toggle("hidden");
  openModalButton.classList.toggle("hidden");
  filter.classList.toggle("hidden");
  datesLine.classList.toggle("hidden");
  titleElement.classList.toggle("hidden");
}

// скрытие ненужных элементов при открытии окна редактирования
function switchingClassForEditModal() {
  tasksList.classList.toggle("hidden");
  editModal.classList.toggle("hidden");
  openModalButton.classList.toggle("hidden");
  filter.classList.toggle("hidden");
  datesLine.classList.toggle("hidden");
  titleElement.classList.toggle("hidden");
}

// событие по клику на кнопку
addButton.onclick = function (event) {
  event.preventDefault(); // запрет на обновление страницы при нажатии на кнопку добавить
  // получение и обрезка лишних пустых симовлов из инпутов
  let taskName = document.getElementById("taskName").value.trim();
  let deadline = document.getElementById("deadline").value;
  let category = document.getElementById("category").value;

  // проверка на пустой инпут
  if (!taskName) {
    alert("Enter a task");
    return;
  } else if (!deadline) {
    alert("Enter a deadline");
    return;
  } else if (!category) {
    alert("Choose a category");
    return;
  }

  // объект новой задачи
  const newTask = {
    id: crypto.randomUUID(), // генерация ID
    taskName,
    category,
    deadline,
    isDone: false, // задача не выполнена по умолчанию
  };

  myTasks.push(newTask); // добавление новой задачи в наш массив
  saveTasks(myTasks); // сохранение объекта
  sortTasks(myTasks); // сортировка задач (невыполненные сверху)

  // очистка полей
  document.getElementById("taskName").value = "";
  document.getElementById("deadline").value = "";
  document.getElementById("category").value = "";

  switchingClassForAddModal();
  updateInterface();
};

tasksList.onclick = function (event) {
  // событие по клику на список задач
  const target = event.target; // ловим куда реально кликнули
  // если есть нужный элемент создаем для него переменную
  const taskItem = target.closest(".to-do-item");
  const checkbox = target.closest(".checkbox");

  if (checkbox) {
    // если нажали на чекбокс
    const taskID = checkbox.dataset.id;

    // поиск задачи по чекбоксу которой кликнули
    let foundTask = myTasks.find((task) => task.id === taskID);

    if (foundTask) {
      // если она есть
      foundTask.isDone = !foundTask.isDone; // переключение статуса при клике
      const parentLi = checkbox.closest(".to-do-item");
      parentLi.classList.toggle("done");
    }

    sortTasks(myTasks); // сортировка
    saveTasks(myTasks); // сохранение
    updateInterface(); // отображение

    return;
  }
  if (taskItem) {
    // если нажали на саму задачу - режим редактирования
    const taskID = taskItem.dataset.id;
    let foundTask = myTasks.find((task) => task.id === taskID);

    // передаем в инпуты текущие значения
    document.querySelector("#renameTask").value = foundTask.taskName;
    document.querySelector("#newDeadline").value = foundTask.deadline;
    document.querySelector("#editCategory").value = foundTask.category;

    deleteButton.dataset.id = taskID; // присваеваем кнопке удаления айди задачи
    saveButton.dataset.id = taskID; // присваеваем кнопке сохранения айди задачи
    switchingClassForEditModal(); // скрывваем ненужное и отображаем нужное
  }
};

// событие по нажатию на кнопку "delete"
deleteButton.onclick = function () {
  const taskID = this.dataset.id; //получаем id задачи из кнопки

  // если айди нужное найдено
  if (taskID) {
    myTasks = deleteTask(myTasks, taskID); // запускаем функцию удаления
    saveTasks(myTasks); // сохраняем
    updateInterface(); // обновляем

    // Закрываем модалку после удаления и отображаем нужное
    switchingClassForEditModal();
  }
};

// функция удаления задачи
function deleteTask(tasks, id) {
  // фильтруем удаленную задачу от других
  return tasks.filter((task) => task.id !== id);
}

// событие по кнопке "Сохранить"
saveButton.onclick = function () {
  const id = this.dataset.id;
  const task = myTasks.find((task) => task.id === id);

  // если зачача найдена
  if (task) {
    // записываем в переменнуе новые значения
    const newNameTask = document.querySelector("#renameTask").value.trim();
    const newDeadline = document.querySelector("#newDeadline").value.trim();
    const newCategory = document.querySelector("#editCategory").value.trim();

    // прописываем новые значения в объект
    task.taskName = newNameTask;
    task.deadline = newDeadline;
    task.category = newCategory;

    saveTasks(myTasks); // сохраняем
    switchingClassForEditModal(); // скрываем/отображаем
    updateInterface();
  }
};

// при изменении выбранного в фильтре значения обновляем интерфейс
filterSelect.onchange = updateInterface;

function updateInterface() {
  // если элемент найден
  if (titleElement) {
    // присваеваем ему значение из функции
    titleElement.textContent = getDateTitle(currentSelectedDate);
  }

  let value = filterSelect.value;

  // фильтруем по дате (если она выбрана)
  let filtered = myTasks.filter((task) => {
    if (!currentSelectedDate) return true; // если дата не выбрана, берем все
    // если выбрана то присваеваем это значение переменной
    return task.deadline === currentSelectedDate;
  });

  // фильтруем то, что осталось, по статусу (All/Completed/Unfulfilled)
  filtered = filtered.filter((task) => {
    if (value === "allTasks" || value === "byCategory") return true;
    if (value === "completed") return task.isDone;
    if (value === "unfulfilled") return !task.isDone;
    return true;
  });

  // отрисовываем итоговый массив
  if (value === "byCategory") {
    displayGroupedTasks(filtered); // отоюражение по категориям
  } else {
    displayList(filtered); // просто отображение
  }
}

// функция сортровки задач
function sortTasks(myTasks) {
  myTasks.sort((a, b) => a.isDone - b.isDone);
}

// функция получения массива дат
function getDatesRange(today) {
  let arrayOfDays = [];

  for (let i = -2; i < 33; i++) {
    // два дня до сегодня до 33 дней
    let date = new Date(today);
    date.setDate(date.getDate() + i);

    arrayOfDays.push(date); // добавляем полученную дату в массив
  }

  return arrayOfDays; // возвращаем массив
}

// обновляем глобльную переменную и обновляем экран
function handleDateClick(selectedDate) {
  currentSelectedDate = selectedDate; // запись дня который выбран юзерм
  updateInterface(); // обновление интерфейса
}

const week = getDatesRange(new Date()); // создаем массив объектов от сегодня
renderDateStrip(week, handleDateClick); // генерируем кнопки и привязваем клик

const todayISO = new Date().toISOString().split("T")[0]; // получаем дату в нужном формате
handleDateClick(todayISO); // программано "кликаем" на сегодня, чтобы задачи отфильтровались сразу

// выполнение кода с отсрочкой (сразу после отрисовки html)
setTimeout(() => {
  const todayBtn = document.querySelector(`[data-date="${todayISO}"]`);
  if (todayBtn) todayBtn.classList.add("isSelected"); // подсветка кнопки выбранного дня
}, 0);
