// ================================
// TO-DO APPLICATION
// ================================


// ---------- STATE ----------

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// ---------- DOM ELEMENTS ----------

const todoForm = document.getElementById("todo-form");

const todoInput = document.getElementById("todo-input");

const todoList = document.getElementById("todo-list");

const todoCount = document.getElementById("todo-count");

const filterButtons = document.querySelectorAll(".filter-btn");


// ---------- SAVE STATE ----------

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// ---------- CREATE TASK ----------

todoForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText = todoInput.value.trim();

    if (taskText === "") {
        return;
    }


    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    tasks.push(newTask);


    saveTasks();

    renderTasks();


    todoInput.value = "";

    todoInput.focus();

});


// ---------- RENDER TASKS ----------

function renderTasks() {

    todoList.innerHTML = "";


    let filteredTasks = tasks;


    // Apply filter

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(function (task) {

            return !task.completed;

        });

    }


    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function (task) {

            return task.completed;

        });

    }


    // Create DOM elements

    filteredTasks.forEach(function (task) {

        const li = document.createElement("li");

        li.className = "todo-item";

        li.dataset.id = task.id;


        if (task.completed) {

            li.classList.add("completed");

        }


        li.innerHTML = `

            <label class="todo-task">

                <input
                    type="checkbox"
                    data-action="toggle"
                    ${task.completed ? "checked" : ""}
                >

                <span>${escapeHTML(task.text)}</span>

            </label>

            <div class="todo-actions">

                <button
                    type="button"
                    data-action="edit">
                    Edit
                </button>

                <button
                    type="button"
                    data-action="delete">
                    Delete
                </button>

            </div>

        `;


        todoList.appendChild(li);

    });


    updateCount();

}


// ---------- EVENT DELEGATION ----------

todoList.addEventListener("click", function (event) {

    const button = event.target.closest("[data-action]");

    if (!button) {
        return;
    }


    const todoItem = button.closest(".todo-item");

    const taskId = Number(todoItem.dataset.id);

    const action = button.dataset.action;


    // DELETE

    if (action === "delete") {

        deleteTask(taskId);

    }


    // EDIT

    if (action === "edit") {

        editTask(taskId);

    }

});


// ---------- CHECKBOX EVENT ----------

todoList.addEventListener("change", function (event) {

    if (event.target.dataset.action !== "toggle") {
        return;
    }


    const todoItem = event.target.closest(".todo-item");

    const taskId = Number(todoItem.dataset.id);


    tasks = tasks.map(function (task) {

        if (task.id === taskId) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

});


// ---------- DELETE ----------

function deleteTask(taskId) {

    tasks = tasks.filter(function (task) {

        return task.id !== taskId;

    });


    saveTasks();

    renderTasks();

}


// ---------- EDIT ----------

function editTask(taskId) {

    const task = tasks.find(function (task) {

        return task.id === taskId;

    });


    if (!task) {
        return;
    }


    const newText = prompt("Edit your task:", task.text);


    if (newText === null) {
        return;
    }


    const trimmedText = newText.trim();


    if (trimmedText === "") {
        return;
    }


    task.text = trimmedText;


    saveTasks();

    renderTasks();

}


// ---------- FILTER ----------

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        currentFilter = button.dataset.filter;


        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        renderTasks();

    });

});


// ---------- TASK COUNT ----------

function updateCount() {

    const activeTasks = tasks.filter(function (task) {

        return !task.completed;

    });


    const count = activeTasks.length;


    todoCount.textContent =
        `${count} ${count === 1 ? "task" : "tasks"} remaining`;

}


// ---------- HTML ESCAPE ----------

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ---------- INITIAL RENDER ----------

renderTasks();
