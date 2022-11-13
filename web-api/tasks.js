const API_URL = "http://127.0.0.1:8080/api";
const tbody = document.getElementById("tasks-table-body");
const titleInput = document.getElementById("task-title-input");
const taskAddButton = document.getElementById("task-add-button");
// 汎用的な関数(処理系の関数内で使用する)
const fetchTasks = async () => {
  const res = await fetch(`${API_URL}/tasks`);
  return res.json();
};
const createAsyncTask = async (task) => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    body: JSON.stringify(task),
  });
  return res.json();
};
const setTbody = (fields) => {
  const tr = document.createElement("tr");
  Object.entries(fields).forEach(([_fieldTitle, fieldContent]) => {
    const td = document.createElement("td");
    if (typeof fieldContent !== "string") {
      return;
    }
    td.textContent = fieldContent;
    tr.appendChild(td);
  });
  tbody.appendChild(tr);
};
// 処理系の関数
const registerTask = async () => {
  const task = {
    title: titleInput.value,
    createdAt: new Date().toISOString(),
  };
  const { isValid, message } = validateTask(task);
  if (!isValid) {
    alert(message);
    return;
  }
  titleInput.value = "";
  try {
    const newTask = await createAsyncTask(task);
    setTbody(newTask);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
};
const loadTasks = async () => {
  try {
    const tasks = await fetchTasks();
    tasks.forEach((task) => {
      setTbody(task);
    });
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
};
const validateTask = ({ title }) => {
  if (title === "") {
    return {
      isValid: false,
      message: "タスク名を入力してください",
    };
  }
  if (title.length < 1 || title.length > 20) {
    return {
      isValid: false,
      message: "タスク名は1文字以上20文字以下で入力してください",
    };
  }
  return {
    isValid: true,
    message: "",
  };
};
// 読み込みやイベントの登録(useEffect的な)
const main = async () => {
  loadTasks();
  taskAddButton.addEventListener("click", registerTask);
};
window.addEventListener("DOMContentLoaded", main);
