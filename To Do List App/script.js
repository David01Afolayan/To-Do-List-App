let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const deleteSelectedBtn = document.getElementById("delete-selected");
const counter = document.getElementById("counter");
const clearBtn = document.getElementById("clearBtn");

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function updateDeletedBtn() {
  const selectedCount = tasks.filter(task => task.selected).length;
  deleteSelectedBtn.hidden = selectedCount === 0;
  counter.textContent = selectedCount > 0
    ? `Total tasks: ${tasks.length} | Selected: ${selectedCount}`
    : `Total tasks: ${tasks.length}`;
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = "No tasks yet. Add your first task above.";
    taskList.appendChild(emptyState);
    updateDeletedBtn();
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <input type="checkbox" class="select-task" data-id="${task.id}" ${task.selected ? "checked" : ""}>
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <button class="toggle-btn" type="button">${task.completed ? "Undo" : "Done"}</button>
        <button class="delete-btn" type="button">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateDeletedBtn();
}

function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    alert("Please enter a task.");
    return;
  }

  tasks.push({
    id: Date.now(),
    text,
    completed: false,
    selected: false
  });

  taskInput.value = "";
  saveAndRender();
  taskInput.focus();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

taskList.addEventListener("click", (event) => {
  const toggleBtn = event.target.closest(".toggle-btn");
  const deleteBtn = event.target.closest(".delete-btn");

  if (toggleBtn) {
    const li = toggleBtn.closest("li");
    const id = Number(li.dataset.id);
    const task = tasks.find(item => item.id === id);

    if (task) {
      task.completed = !task.completed;
      saveAndRender();
    }
  }

  if (deleteBtn) {
    const li = deleteBtn.closest("li");
    const id = Number(li.dataset.id);
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
  }
});

taskList.addEventListener("change", (event) => {
  const checkbox = event.target.closest(".select-task");

  if (!checkbox) return;

  const id = Number(checkbox.dataset.id);
  const task = tasks.find(item => item.id === id);

  if (task) {
    task.selected = checkbox.checked;
    updateDeletedBtn();
  }
});

deleteSelectedBtn.addEventListener("click", () => {
  const selectedIds = tasks.filter(task => task.selected).map(task => task.id);

  if (selectedIds.length === 0) return;

  tasks = tasks.filter(task => !selectedIds.includes(task.id));
  saveAndRender();
});

clearBtn.addEventListener("click", () => {
  if (tasks.length === 0) {
    alert("No tasks to clear.");
    return;
  }

  const confirmClear = confirm("Delete all tasks?");

  if (confirmClear) {
    tasks = [];
    saveAndRender();
  }
});

renderTasks();
