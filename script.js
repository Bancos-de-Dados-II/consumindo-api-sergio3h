const API_URL = "http://localhost:3000/tasks";
let isEditing = false;

// Quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    setupEventListeners();
});
