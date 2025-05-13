const API_URL = "http://localhost:3000/tasks";
let isEditing = false;

// Quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    setupEventListeners();
});

function setupEventListeners() {
    const taskForm = document.getElementById("taskForm");
    const cancelButton = document.getElementById("cancelButton");
    const refreshButton = document.getElementById("refreshButton");
    const filterType = document.getElementById("filterType");
    
    taskForm.addEventListener("submit", handleFormSubmit);
    cancelButton.addEventListener("click", resetForm);
    refreshButton.addEventListener("click", loadTasks);
    filterType.addEventListener("change", loadTasks);
}

async function loadTasks() {
    try {
        const filterType = document.getElementById("filterType").value;
        let url = API_URL;
        
        if (filterType) {
            url += `?tipo=${filterType}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        showMessage(`Erro ao carregar tarefas: ${error.message}`, 'error');
        console.error("Erro ao carregar tarefas:", error);
    }
}