// // // constantes
// armazenamento local
const localStorageTarefas = localStorage.getItem('tarefas');
// furmulário de tarefas
const taskListContainer = document.querySelector('.app__section-task-list');
const formTask = document.querySelector('.app__form-add-task');
const formLabel = document.querySelector('.app__form-label');
const textArea = document.querySelector('.app__form-textarea');
// // botoes
// botões formulário
const toggleFormTaskBtn = document.querySelector('.app__button--add-task');
const cancelFormTaskBtn = document.querySelector('.app__form-footer__button--cancel');
const cancelBtn = document.querySelector('.app__form-footer__button--cancel');
const deleteBtn = document.querySelector('.app__form-footer__button--delete');
// botões ⁝ (more)
const deleteAllBtn = document.querySelector('#btn-remover-todas');
const deleteAllCompletesBtn = document.querySelector('#btn-remover-concluidas');

// tarefas
const taskActiveDescription = document.querySelector('.app__section-active-task-description');
const taskIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="12" fill="#FFF" />
<path
d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
fill="#01080E" />
</svg>
`;
let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas) : [];
let tarefaSelecionada = null;
let itemTarefaSelecionada = null;
let paragraphEmEdicao = null;
let tarefaEmEdicao = null;

// seleciona uma tarefa
const selectTask = (tarefa, item) => {
    // tarefa concluida não pode ser desmarcada
    if (tarefa.concluida) {
        return
    }
    // // remove a seleção de todas as tarefas
    document.querySelectorAll('.app__section-task-list-item-active').forEach(function(button) {
        button.classList.remove('app__section-task-list-item-active');
    });
    // ignora tarefa em andamento
    if (tarefaSelecionada == tarefa) {
        taskActiveDescription.textContent = null;
        tarefaSelecionada = null;
        itemTarefaSelecionada = null;
        return
    }
    // marca tarefa selecionada
    tarefaSelecionada = tarefa;
    itemTarefaSelecionada = item;
    taskActiveDescription.textContent = tarefa.descricao;
    item.classList.add('app__section-task-list-item-active'); 
}

// limpa o formulário
const clearForm = () => {
    tarefaEmEdicao = null;
    paragraphEmEdicao = null;

    textArea.value = '';
    formTask.classList.add('hidden');
}

// seleciona tarefa para edita-la
const selectTaskForEdit = (tarefa, elemento) => {
    if (tarefaEmEdicao == tarefa) {
        clearForm();
        return
    }
    // abre o formulário para edição
    formLabel.textContent = 'Editando Tarefa';
    tarefaEmEdicao = tarefa;
    paragraphEmEdicao = elemento;
    textArea.value = tarefa.descricao;
    formTask.classList.remove('hidden');
}

const deleteTask = (somenteConcluidas) => {
    // verifica se é pra deletar tudo ou somente o que está concluído e filtra
    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach((elemento) => {
        elemento.remove();
    });
    // insere o restante da lista, se houver
    tarefas = somenteConcluidas ? tarefas.filter(t => !t.concluida) : [];
    updateLocalStorage();
}

// cria uma tarefa
function createTask(tarefa) {
    // cria um item de lista e lhe dá uma classe
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');
    // cria um icone para conclusão de tarefa
    const svgIcon = document.createElement('svg');
    svgIcon.innerHTML = taskIconSvg;
    // cria um texto para a descrição da tarefa e lhe dá uma classe
    const paragraph = document.createElement('p');
    paragraph.classList.add('app__section-task-list-item-description');
    paragraph.textContent = tarefa.descricao;    
    // cria um botao para editar a tarefa
    const button = document.createElement('button');
    button.classList.add('app__button-edit');
    // cria um botão para marcar a tarefa como concluída 
    const editIcon = document.createElement('img');
    editIcon.setAttribute('src', 'imagens/edit.png');
    
    button.appendChild(editIcon);

    // seleciona tarefa para editar
    button.addEventListener('click', (evento) => {
        evento.stopPropagation();
        selectTaskForEdit(tarefa, paragraph);
    });
    // seleciona uma tarefa 
    li.onclick = () => {
        selectTask(tarefa, li);
    }
    // sistema de conclusão de tarefa
    svgIcon.addEventListener('click', (event) => {
        if (tarefa == tarefaSelecionada) {
            event.stopPropagation();
            tarefaSelecionada.concluida = true;
            button.setAttribute('disabled', true);
            li.classList.add('app__section-task-list-item-complete');
            
            updateLocalStorage();
        }
    });

    if (tarefa.concluida) {
        button.setAttribute('disabled', true)
        li.classList.add('app__section-task-list-item-complete')
    };
    // exibe os elementos criados
    li.appendChild(svgIcon);
    li.appendChild(paragraph);
    li.appendChild(button);

    return li;
}

// mostra o formulario
tarefas.forEach(task => {
    const taskItem = createTask(task);
    taskListContainer.appendChild(taskItem);
});

// botão cancelar - esconder formulário
cancelFormTaskBtn.addEventListener('click', () => {
    formTask.classList.add('hidden');
});

// botão cancelar - limpar formulário
cancelBtn.addEventListener('click', clearForm);

// botão deletar - formulario
deleteBtn.addEventListener('click', () => {
    if (tarefaSelecionada) {
        const index = tarefas.indexOf(tarefaSelecionada);
        if (index !== -1) {
            tarefas.splice(index, 1);
        }

        itemTarefaSelecionada.remove();
        tarefas.filter(t=> t!= tarefaSelecionada);
        itemTarefaSelecionada = null;
        tarefaSelecionada = null;
    }

    updateLocalStorage();
    clearForm();
});

// botão deletar todas as tarefas -- more
deleteAllBtn.addEventListener('click' , () => deleteTask(false));

// botão deletar todas as tarefas concluidas -- more
deleteAllCompletesBtn.addEventListener('click' , () => deleteTask(true));

// controla exibição do formulário
toggleFormTaskBtn.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando tarefa';
    formTask.classList.toggle('hidden');
});

// armazana a tarefa no Local Storage
const updateLocalStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas)); 
}

// adiciona tarefas ao formulário
formTask.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (tarefaEmEdicao) {
        tarefaEmEdicao.descricao = textArea.value;
        paragraphEmEdicao.textContent = textArea.value;
    } else {
        // preenche o array com a tarefa
        const task = {
            descricao: textArea.value,
            concluida: false
        }
        tarefas.push(task);
        
        const taskItem = createTask(task);
        taskListContainer.appendChild(taskItem);
    }
    
    updateLocalStorage();
    clearForm();
});

// finaliza tarefa selecionada ao final do timer
document.addEventListener('TarefaFinalizada', function () {
    if (tarefaSelecionada) {
        tarefaSelecionada.concluida = true;
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        itemTarefaSelecionada.querySelector('button').setAttribute('disabled', true);
        updateLocalStorage();
    }
});