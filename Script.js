document.addEventListener("DOMContentLoaded", () => {
  // Select elements safely
  const select = (selector) => document.querySelector(selector);

  const addTaskBtn = select(".add-task");
  const toggleModeBtn = select(".toggle-mode");
  const pomodoroBtn = select(".pomodoro");
  const startBtn = select(".start-btn");
  const pauseBtn = select(".pause-btn");
  const resetBtn = select(".reset-btn");
  const backBtn = select(".back-btn");
  const durationButtons = document.querySelectorAll(".duration-tab");
  const customDurationInput = select("#custom-duration");
  const setCustomDurationBtn = select("#set-custom-duration");

  let timer;
  let timeLeft = 1500; // Default to 25 minutes
  let isRunning = false;
  let xp = 0; // Initialize XP
  let selectedDuration = 1500; // Track the currently selected duration

  const timerDisplay = select(".timer");
  const circleProgress = select(".circle-progress");
  const kanbanContainer = select(".kanban-container");
  const pomodoroContainer = select(".pomodoro-container");
  const xpDisplay = select(".gems"); // Select the XP display element

  // Function to update XP display
  function updateXpDisplay() {
    if (xpDisplay) {
      xpDisplay.textContent = `💎 XP: ${xp}`;
    }
  }

  // Function to award XP
  function awardXp(amount) {
    xp += amount;
    updateXpDisplay();
  }

// Profile Modal Functionality
const profileBtn = select(".profile-btn");
const profileModal = select("#profile-modal");
const closeBtn = select(".close-btn");
const profileForm = select("#profile-form");
const loginBtn = select("#login-btn");

// Open Profile Modal
if (profileBtn) {
  profileBtn.addEventListener("click", () => {
    profileModal.style.display = "flex";
  });
}

// Close Profile Modal
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    profileModal.style.display = "none";
  });
}

// Close Modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === profileModal) {
    profileModal.style.display = "none";
  }
});

// Handle Profile Form Submission (Sign Up)
if (profileForm) {
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const email = select("#email").value;
    const password = select("#password").value;

    // Validate inputs
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    // Check if the email is already registered
    if (localStorage.getItem(email)) {
      alert("This email is already registered. Please log in.");
      return;
    }

    // Create a user object
    const userData = {
      email: email,
      password: password,
      xp: 0, // Initialize XP
      tasks: [], // Initialize tasks
    };

    // Store user data in localStorage
    localStorage.setItem(email, JSON.stringify(userData));

    // Close the modal
    profileModal.style.display = "none";

    // Notify the user
    alert("Profile created successfully!");
  });
}

// Handle Login Button Click
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    // Prompt for Email ID
    const email = prompt("Enter your Email ID:");

    // Check if email exists in localStorage
    const savedData = localStorage.getItem(email);

    if (!savedData) {
      alert("Email not found. Please sign up.");
      return;
    }

    // Parse saved data
    const userData = JSON.parse(savedData);

    // Prompt for Password
    const password = prompt("Enter your Password:");

    // Validate password
    if (password === userData.password) {
      alert("Login successful!");
      profileModal.style.display = "none"; // Close the modal
    } else {
      alert("Invalid password.");
    }
  });
}
  
  
// Add event listeners to duration buttons
durationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    durationButtons.forEach((btn) => btn.classList.remove("active"));

    // Add active class to the clicked button
    button.classList.add("active");

    // Set the duration
    const duration = parseInt(button.getAttribute("data-duration"));

    setDuration(duration); // Call setDuration to update timeLeft and display
  });
});


// Function to set the timer duration
function setDuration(duration) {
  selectedDuration = duration; // Update the selected duration
  timeLeft = duration; // Reset timeLeft to the new duration
  updateTimerDisplay(); // Update the timer display
  resetTimer(); // Reset the timer
}
  setCustomDurationBtn.addEventListener("click", () => {
  const customMinutes = parseInt(customDurationInput.value);
  
  if (!isNaN(customMinutes) && customMinutes >= 5 && customMinutes <= 120) {
    const customSeconds = customMinutes * 60;
    setDuration(customSeconds);
  } else {
    alert("Please enter a time between 5 and 120 minutes.");
  }
});


// Function to start the timer
function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timer);
        if (timerDisplay) timerDisplay.classList.add("shake");
        alert("Time's up! Take a break.");
        isRunning = false;
      }
    }, 1000);
  }
}

// Function to pause the timer
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

// Function to reset the timer
function resetTimer() {
  clearInterval(timer);
  timeLeft = selectedDuration; // Reset to the currently selected duration
  isRunning = false;
  updateTimerDisplay();
  if (timerDisplay) timerDisplay.classList.remove("shake");
}

  function addTask() {
    const taskText = prompt("Enter your task:");
    if (taskText) {
      const task = document.createElement("div");
      task.classList.add("task");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("task-checkbox");

      const label = document.createElement("span");
      label.innerText = taskText;

      task.appendChild(checkbox);
      task.appendChild(label);
      select("#backlog .task-list").appendChild(task);

      checkbox.addEventListener("change", () => moveTask(task, checkbox));
    }
  }

  function moveTask(task, checkbox) {
    const parentColumn = task.parentElement.parentElement.id;

    if (parentColumn === "backlog") {
      select("#doing .task-list").appendChild(task);
    } else if (parentColumn === "doing") {
      select("#done .task-list").appendChild(task);
      checkbox.remove();
      awardXp(10); // Award 10 XP when a task is moved to "Completed"
    }
  }

  function toggleMode() {
    document.body.classList.toggle("light-mode");
    if (toggleModeBtn) {
      toggleModeBtn.innerText = document.body.classList.contains("light-mode")
        ? "☀️"
        : "🌙";
    }
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");
    if (timerDisplay) timerDisplay.textContent = `${minutes}:${seconds}`;

    // Calculate the progress percentage based on the selected duration
    const progressPercentage = ((timeLeft / selectedDuration) * 100).toFixed(2);
    if (circleProgress) {
      circleProgress.style.background = `conic-gradient(#ff9f1c ${progressPercentage}%, transparent ${progressPercentage}%)`;
    }
  }

  function startTimer() {
    if (!isRunning) {
      isRunning = true;
      timer = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateTimerDisplay();
        } else {
          clearInterval(timer);
          if (timerDisplay) timerDisplay.classList.add("shake");
          alert("Time's up! Take a break.");
          isRunning = false;
        }
      }, 1000);
    }
  }

  function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
  }

  function resetTimer() {
    clearInterval(timer);
    timeLeft = selectedDuration; // Reset to the currently selected duration
    isRunning = false;
    updateTimerDisplay();
    if (timerDisplay) timerDisplay.classList.remove("shake");
  }

  function showPomodoro() {
    if (kanbanContainer && pomodoroContainer) {
      kanbanContainer.style.opacity = "0";
      setTimeout(() => {
        kanbanContainer.style.display = "none";
        pomodoroContainer.classList.add("active");
        updateTimerDisplay();
      }, 500);
    }
  }

  function enableDragAndDrop() {
    document.querySelectorAll(".task").forEach((task) => {
      task.draggable = true;

      task.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.outerHTML);
        task.classList.add("dragging");
      });

      task.addEventListener("dragend", () => {
        task.classList.remove("dragging");
      });
    });

    document.querySelectorAll(".task-list").forEach((list) => {
      list.addEventListener("dragover", (e) => e.preventDefault());

      list.addEventListener("drop", (e) => {
        e.preventDefault();
        const taskHTML = e.dataTransfer.getData("text/plain");
        list.insertAdjacentHTML("beforeend", taskHTML);
        enableDragAndDrop(); // Reapply listeners

        // Award XP if the task is dropped into the "Completed" column
        if (list.parentElement.id === "done") {
          awardXp(10);
        }
      });
    });
  }

  enableDragAndDrop();

  function showKanban() {
    if (kanbanContainer && pomodoroContainer) {
      pomodoroContainer.classList.remove("active");
      setTimeout(() => {
        kanbanContainer.style.display = "block";
        kanbanContainer.style.opacity = "1";
      }, 500);
    }
  }

  // Add event listeners only if elements exist
  if (addTaskBtn) addTaskBtn.addEventListener("click", addTask);
  if (toggleModeBtn) toggleModeBtn.addEventListener("click", toggleMode);
  if (pomodoroBtn) pomodoroBtn.addEventListener("click", showPomodoro);
  if (startBtn) startBtn.addEventListener("click", startTimer);
  if (pauseBtn) pauseBtn.addEventListener("click", pauseTimer);
  if (resetBtn) resetBtn.addEventListener("click", resetTimer);
  if (backBtn) backBtn.addEventListener("click", showKanban);

  // Initialize XP display
  updateXpDisplay();
});