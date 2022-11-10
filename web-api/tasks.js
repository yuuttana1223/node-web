"use strict";
{
  const API_URL = "http://127.0.0.1:3000/api";
  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/tasks`);
    return res.json();
  };
  const setTBody = (tasks) => {
    const tbody = document.getElementById("tasks-table-body");
    if (tbody === null) {
      return;
    }
    tasks.forEach((task) => {
      const tr = document.createElement("tr");
      Object.entries(task).forEach(([_columnName, field]) => {
        const td = document.createElement("td");
        td.textContent = field;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  };
  const main = async () => {
    const tasks = await fetchTasks();
    setTBody(tasks);
  };

  window.addEventListener("DOMContentLoaded", main);
}
