let tasks = []; 

document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));

    if (storedTasks) {
        tasks = storedTasks;
        updateTasksList();
        updateStats();
        saveTasks();
    }
});

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const addTask = () => {
    const taskInput = document.getElementById("task-input");
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = "";
        updateTasksList();
        updateStats();
        saveTasks();
    }
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasks();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
};

const editTask = (index) => {
    const taskInput = document.getElementById("task-input");
    taskInput.value = tasks[index].text;

    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
};

// Keep track of the last state so we don't spam confetti
let allDone = false;

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    // Update Text
    document.getElementById("total-tasks").textContent = total;
    document.getElementById("completed-tasks").textContent = completed;
    document.getElementById("pending-tasks").textContent = pending;

    // Update Progress Bar
    const progressPercent = total === 0 ? 0 : (completed / total) * 100;
    document.getElementById("progress").style.width = progressPercent + "%";

    // CHECK: Should we blast confetti?
    // We only blast if they just finished (completed === total) 
    // AND they actually have tasks (total > 0)
    // AND we haven't already celebrated this specific completion (allDone)
    if (total > 0 && completed === total) {
        if (!allDone) {
            blastConfetti();
            allDone = true; // Mark as celebrated
        }
    } else {
        allDone = false; // Reset if they uncheck a task
    }
};

const blastConfetti = () => {
    // Play the sound

    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
    audio.volume = 0.5; // Set the volume to 50%
    audio.play().catch(err => console.log("Audio playback blocked until user interacts with the page."));
    
    // Fire the confetti method

    confetti("tsparticles", {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#1E00FF", "#FF0061", "#E1FF00", "#00FF9E"],
        ticks: 300, // How long the particles stay on screen
        gravity: 1,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle", "square", "triangle"]
    });
};

const updateTasksList = () => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
        <div class="task-item">
            <div class="task ${task.completed ? "completed" : ""}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}/>
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img src="assets/img/Edit.svg" onclick="editTask(${index})"/>
                <img src="assets/img/Delete.svg" onclick="deleteTask(${index})"/>
            </div>
        </div>
        `;

        listItem.addEventListener("change", () => toggleTaskComplete(index));
        taskList.append(listItem);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("new-task").addEventListener("click", function (e) {
    e.preventDefault();
    addTask();
    });
});
