import { saveTasks, loadTasks } from "./storage.js";

const test = { text: "пупупу" };
saveTasks(test);
console.log("Сохранено");

const loaded = loadTasks();
console.log("Загружено из базы:", loaded);
