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
function renderTasks(tasks) {
    const taskList = document.getElementById("taskList");
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="message">Nenhuma tarefa encontrada.</div>';
        return;
    }
    
    taskList.innerHTML = tasks.map(task => `
        <div class="task ${task.tipo.toLowerCase()}" data-id="${task.id}">
            <h3>${escapeHTML(task.titulo)}</h3>
            <p>${task.descricao ? escapeHTML(task.descricao) : "Sem descrição"}</p>
            <div class="task-meta">
                <span>Tipo: ${task.tipo}</span>
                <span>Criada em: ${formatDate(task.dataHora)}</span>
            </div>
            <div class="task-actions">
                <button class="btn btn-primary" onclick="editTask('${task.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger" onclick="deleteTask('${task.id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `).join("");
}

// Manipula o envio do formulário
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const taskId = document.getElementById("taskId").value;
    const titulo = document.getElementById("taskTitle").value.trim();
    const descricao = document.getElementById("taskDescription").value.trim();
    const tipo = document.getElementById("taskType").value;
    
    if (!titulo || !tipo) {
        showMessage("Título e tipo são obrigatórios", 'error');
        return;
    }
    
    const taskData = { titulo, descricao, tipo };
    
    try {
        let response;
        
        if (taskId) {
            // Atualizar tarefa existente
            response = await fetch(`${API_URL}/${taskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskData),
            });
            
            if (!response.ok) {
                throw new Error(`Erro ao atualizar tarefa: ${response.status}`);
            }
            
            showMessage("Tarefa atualizada com sucesso!", 'success');
        } else {
            // Criar nova tarefa
            response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskData),
            });
            
            if (!response.ok) {
                throw new Error(`Erro ao criar tarefa: ${response.status}`);
            }
            
            showMessage("Tarefa criada com sucesso!", 'success');
        }
        
        resetForm();
        loadTasks();
    } catch (error) {
        showMessage(`Erro ao salvar tarefa: ${error.message}`, 'error');
        console.error("Erro ao salvar tarefa:", error);
    }
}

// Prepara o formulário para edição
async function editTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const task = await response.json();
        
        document.getElementById("taskId").value = task.id;
        document.getElementById("taskTitle").value = task.titulo;
        document.getElementById("taskDescription").value = task.descricao || '';
        document.getElementById("taskType").value = task.tipo;
        document.getElementById("saveButton").innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar';
        
        isEditing = true;
        
        // Rolagem suave para o formulário
        document.querySelector('.task-form').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        showMessage(`Erro ao carregar tarefa para edição: ${error.message}`, 'error');
        console.error("Erro ao carregar tarefa para edição:", error);
    }
}

// Exclui uma tarefa
async function deleteTask(id) {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        showMessage("Tarefa excluída com sucesso!", 'success');
        loadTasks();
    } catch (error) {
        showMessage(`Erro ao excluir tarefa: ${error.message}`, 'error');
        console.error("Erro ao excluir tarefa:", error);
    }
}

// Reseta o formulário
function resetForm() {
    document.getElementById("taskForm").reset();
    document.getElementById("taskId").value = '';
    document.getElementById("saveButton").innerHTML = '<i class="fas fa-save"></i> Salvar';
    isEditing = false;
}

// Formata a data para exibição
function formatDate(dateString) {
    if (!dateString) return 'Data não disponível';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Exibe mensagens para o usuário
function showMessage(text, type) {
    // Remove mensagens anteriores
    const oldMessages = document.querySelectorAll('.message');
    oldMessages.forEach(msg => msg.remove());
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = text;
    
    const container = document.querySelector('.container');
    container.insertBefore(messageElement, container.firstChild);
    
    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Previne XSS escapando HTML
function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}