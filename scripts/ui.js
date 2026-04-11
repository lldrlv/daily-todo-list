export function displayList(myTasksInner) {
  const list = document.querySelector(".to-do-list"); // добаляем ul в переменную
  list.innerHTML = ""; // очищаем отрисовку в начале функции, чтобы задачи не множились

  //перебираем задачи
  myTasksInner.forEach((task) => {
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

    list.appendChild(item); // присваевам li родителя list (ul)
  });
}

export function displayGroupedTasks(myTasksInner) {
  const list = document.querySelector(".to-do-list"); // добаляем ul в переменную
  list.innerHTML = ""; // очищаем отрисовку в начале функции, чтобы задачи не множились

  const categories = [...new Set(myTasksInner.map((t) => t.category))];
  categories.sort();

  categories.forEach((category) => {
    const title = document.createElement("h3");
    title.textContent = category;
    list.appendChild(title);

    const categoryTasks = myTasksInner.filter(
      (task) => task.category === category,
    );

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

      list.appendChild(item); // присваевам li родителя list (ul)
    });
  });
}
