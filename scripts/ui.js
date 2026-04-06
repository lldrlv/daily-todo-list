export function displayList(myTasks) {
  const list = document.querySelector(".to-do-list"); // добаляем ul в переменную
  list.innerHTML = ""; // очищаем отрисовку в начале функции, чтобы задачи не множились

  //перебираем задачи
  myTasks.forEach((task) => {
    const item = document.createElement("li"); //создаем li
    item.className = "to-do-item"; // задаем класс для li

    //вставляем в li информацию из объекта
    item.innerHTML = ` 
    <input type="checkbox">
    <span>${task.taskName}</span>
    <button class="delete-button" data-id=${task.id}>Delete</button>
    `;

    list.appendChild(item); // присваевам li родителя list (ul)
  });
}
