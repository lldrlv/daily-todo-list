export function displayList(myTasksInner) {
  // переменная для списка
  const list = document.querySelector(".to-do-list");
  // очищаем отрисовку в начале функции, чтобы задачи не множились
  list.innerHTML = "";

  //перебираем задачи
  myTasksInner.forEach((task) => {
    const item = document.createElement("li"); //создаем li
    item.className = "to-do-item"; // задаем класс для li
    item.dataset.id = task.id; // присваемвам data-id

    const isDoneClass = task.isDone ? "done" : ""; // проверяем статус
    item.className = `to-do-item ${isDoneClass}`; // добавляем класс li

    //вставляем в li информацию из объекта
    item.innerHTML = ` 
        <input type="checkbox" class="checkbox" data-id="${task.id}" ${task.isDone ? "checked" : ""}>
        <span class="task-text">${task.taskName}
          <span class="strike-line"></span>
        </span>
        
      `;

    list.appendChild(item); // присваевам li родителя list (ul)
  });
}

// отображение задач по группам
export function displayGroupedTasks(myTasksInner) {
  // переменная для списка
  const list = document.querySelector(".to-do-list");
  // очищаем отрисовку в начале функции, чтобы задачи не множились
  list.innerHTML = "";

  // записываем уникальные категории в массив
  const categories = [...new Set(myTasksInner.map((task) => task.category))];
  categories.sort(); // сортируем его

  categories.forEach((category) => {
    // для каждой категории создаем заголовок
    const title = document.createElement("h3");
    title.textContent = category; // прописываем в нем название категории
    list.appendChild(title); // присваиваем заголовку родителя (списко)

    // фильтруем по категориям список задач
    const categoryTasks = myTasksInner.filter(
      (task) => task.category === category,
    );

    // отображаем задачи по категориям
    categoryTasks.forEach((task) => {
      const item = document.createElement("li"); //создаем li
      item.className = "to-do-item"; // задаем класс для li
      item.dataset.id = task.id;

      const isDoneClass = task.isDone ? "done" : ""; // Проверяем статус
      item.className = `to-do-item ${isDoneClass}`; // Добавляем класс li

      //вставляем в li информацию из объекта
      item.innerHTML = ` 
        <input type="checkbox" class="checkbox" data-id="${task.id}" ${task.isDone ? "checked" : ""}>
        <span class="task-text">${task.taskName}
          <span class="strike-line"></span>
        </span>
        
      `;

      list.appendChild(item); // присваиваем li родителя list (ul)
    });
  });
}

// создание ленты дат
export function renderDateStrip(arrayOfDays, onDateClick) {
  // находим нужный див куда вставим даты
  const datesContainer = document.querySelector(".dates");
  if (!datesContainer) return; // если не найдет то стоп

  datesContainer.innerHTML = ""; // очищаем чтобы не дублировалось ничего

  // проходимся по массиву дат
  // для каждого создаем кнопку и отображаем день и дату
  arrayOfDays.forEach((date) => {
    const dateCell = document.createElement("button");
    dateCell.classList.add("date-cell");

    // преобразование даты в нужный формат
    const dateISO = date.toISOString().split("T")[0];
    dateCell.dataset.date = dateISO;

    dateCell.innerHTML = `
      <span class='cell-day'>${date.toLocaleDateString("en-US", { weekday: "short" })} </span>
      <span class='cell-date'> ${date.getDate()}</span>
    `;

    // выделение кнопки выбранной даты
    dateCell.addEventListener("click", () => {
      // проверяем была ли кнопка активна
      const isAlreadyActive = dateCell.classList.contains("isSelected");

      // снимаем выделение со всех кнопок
      const currentActive = document.querySelector(".isSelected");
      if (currentActive) {
        currentActive.classList.remove("isSelected");
      }

      // если кнопка НЕ была активна — выделяем её и шлем дату
      if (!isAlreadyActive) {
        dateCell.classList.add("isSelected");
        if (typeof onDateClick === "function") {
          onDateClick(dateISO);
        }
      } else {
        // если была активна — мы её погасили, 
        // теперь шлем null, чтобы показать все задачи
        if (typeof onDateClick === "function") {
          onDateClick(null);
        }
      }
    });
    datesContainer.appendChild(dateCell);
  });
}

// получение заголовка для выбранной даты
export function getDateTitle(selectedDateIso) {
  // если дата не выбарана то отображаем все задачи
  if (!selectedDateIso) return "All tasks";

  const today = new Date();
  const todayIso = today.toISOString().split("T")[0];

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowIso = tomorrow.toISOString().split("T")[0];

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const yesterdayIso = yesterday.toISOString().split("T")[0];

  if (selectedDateIso === todayIso) return "Today";
  if (selectedDateIso === tomorrowIso) return "Tomorrow";
  if (selectedDateIso === yesterdayIso) return "Yesterday";

  // если ни вчера ни сегодня и не завтра то отображаем дату и месяц
  return new Date(selectedDateIso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  });
}
