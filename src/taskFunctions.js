import { closeNewTaskPopup, refreshLists, } from "./UI"
import { updateLocalStorage  } from "./localStorage"

function createNewTodoFactory(title, date, priority, details, check, project) {
    const newListEl = document.createElement('li');
    newListEl.setAttribute('class', 'item');
    newListEl.setAttribute('data-details', details)
    newListEl.setAttribute('data-priority', priority)
    newListEl.setAttribute('data-project', project)

    const titleContainerDivEl = document.createElement('div');
    titleContainerDivEl.setAttribute('class', 'to-do-item');
    const todoTitleEl = document.createElement('h5');
    todoTitleEl.setAttribute('class', 'title')

    todoTitleEl.innerHTML = title;

    titleContainerDivEl.appendChild(todoTitleEl);

    const buttonContainerDivEl = document.createElement('div');
    buttonContainerDivEl.setAttribute('class', 'to-do-btns');
    const editBtnEl = document.createElement('button');
    editBtnEl.setAttribute('class', 'edit-btn items-btn');
    editBtnEl.innerHTML = 'edit';
    const detailsBtnEl = document.createElement('button');
    detailsBtnEl.setAttribute('class', 'details-btn items-btn');
    detailsBtnEl.innerHTML = 'details';
    const dueDateEl = document.createElement('div');
    dueDateEl.setAttribute('class', 'date')
    dueDateEl.innerHTML = date;
    const checkEl = document.createElement('div');
    checkEl.innerHTML = `<i class="fa-solid fa-check"></i>`;
    const binEl = document.createElement('div');
    binEl.innerHTML = `<i class="fa-solid fa-trash"></i>`;

    buttonContainerDivEl.appendChild(editBtnEl);
    buttonContainerDivEl.appendChild(detailsBtnEl);
    buttonContainerDivEl.appendChild(dueDateEl);
    buttonContainerDivEl.appendChild(checkEl);
    buttonContainerDivEl.appendChild(binEl);

    newListEl.appendChild(titleContainerDivEl);
    newListEl.appendChild(buttonContainerDivEl);

    const storedDetails = details;

    let checked = check;
    if (checked === true) {
        newListEl.classList.add("checked");
    } else if (checked === false) {
        newListEl.classList.remove("checked")
    };
    checkTodo(checkEl);
    binTodo(binEl);
    priorityTodo(newListEl, priority);
    detailsTodo(detailsBtnEl, storedDetails);

    return newListEl;
};

function createTodo() {
    let titleIn = document.getElementById("new-todo-title").value;
    let detailsIn = document.getElementById("new-todo-details").value;

    let dateIn = document.getElementById("new-todo-date").value;
    let projectIn = document.getElementById("createSelectProject").value;

    let priorityIn = '';
    const lowPriority = document.getElementById("low-priority");
    const medPriority = document.getElementById("med-priority");
    const highPriority = document.getElementById("high-priority");
    if (lowPriority.checked === true) {
        priorityIn = "low";
    } else if (medPriority.checked === true) {
        priorityIn = "med";
    } else if (highPriority.checked === true) {
        priorityIn = "high"
    } else {
        priorityIn = 'unchecked';
    }

    const newListTodoEL = createNewTodoFactory(titleIn, dateIn, priorityIn, detailsIn, false, projectIn);
    return newListTodoEL;
};

function addTodo(submitType) {
    const list = document.getElementById("list");
    const newTodo = submitType();
    list.appendChild(newTodo);
    updateLocalStorage();
    editTodo();
};

function checkTodo(check) {
    const checkBtnEl = check;

    checkBtnEl.addEventListener("click", () => {
        checkBtnEl.parentElement.parentElement.classList.toggle("checked");
        updateLocalStorage();
    });
};

function binTodo(bin) {
    const binBtnEl = bin;

    binBtnEl.addEventListener("click", () => {
        binBtnEl.parentElement.parentElement.remove();
        updateLocalStorage();
    });
};

function priorityTodo(listItem, priority) {
    let todoEl = listItem;
    let priorityEl = priority;

    if (priorityEl === "high") {
        todoEl.classList.add("high")
    } else if (priorityEl === "med") {
        todoEl.classList.add("med")
    } else if (priorityEl === "low") {
        todoEl.classList.add("low")
    } else {
        todoEl.classList.add("unchecked")
    }
}

function detailsTodo(btn, details) {
    const detailsBtn = btn;
    const detailsTxt = details;
    const closeDetails = document.getElementById("exitDetails");
    const textContainer = document.querySelector(".details-text");
    const listContainer = document.querySelector(".task-list-container");
    const detailsContainer = document.querySelector(".details-popup");

    detailsBtn.addEventListener("click", () => {
        if (details === '') {
            textContainer.innerHTML = "<i>No details</i>"
        } else {
            textContainer.innerHTML = '';
            textContainer.innerHTML = detailsTxt;
        };
        listContainer.classList.add("active");
        detailsContainer.classList.remove("active");
    });
    closeDetails.addEventListener("click", () => {
        textContainer.innerHTML = '';
        listContainer.classList.remove("active");
        detailsContainer.classList.add("active");
    });
}

function editTodo() {
    let todoBtns = document.querySelectorAll(".edit-btn");
    todoBtns.forEach(todoBtn => {
        todoBtn.addEventListener("click", () => {
            const currentTodo = todoBtn
            deleteOldItem(currentTodo);
            openCloseEdit();
            populateEditForm(currentTodo);


        });
    });

}

function deleteOldItem(oldTodo) {
    const formEl = document.getElementById("edit-form")
    formEl.addEventListener("submit", (event) => {
        event.preventDefault();
        oldTodo.parentElement.parentElement.remove();
        updateLocalStorage();
    })
}

function onSubmitEdit() {

    const formEl = document.getElementById("edit-form")
    formEl.addEventListener("submit", (event) => {
        event.preventDefault();
        addTodo(itemFromEditInputs);
        closeEdit();
        updateLocalStorage();
        removeHTMLSelectLabel();
        refreshLists();
    });

}

function closeEdit() {
    const mainContainerEl = document.querySelector(".main-container");
    const editContainerEl = document.querySelector(".popup-edit-container");

    mainContainerEl.classList.remove("active");
    editContainerEl.classList.add("active");
}

function removeHTMLSelectLabel() {
    const label = document.getElementById("select-label")
    label.innerText = '';
}

function itemFromEditInputs() {
    const newTitle = document.getElementById("edit-todo-title").value;
    const newDetails = document.getElementById("edit-todo-details").value;
    const newDate = document.getElementById("edit-todo-date").value;
    const newChecked = false;
    const newProject = document.getElementById("editSelectProject").value

    const formPriorityHigh = document.getElementById("edit-high-priority")
    const formPriorityMed = document.getElementById("edit-med-priority")
    const formPriorityLow = document.getElementById("edit-low-priority")

    let priorityIn = '';
    if (formPriorityLow.checked === true) {
        priorityIn = "low";
    } else if (formPriorityMed.checked === true) {
        priorityIn = "med";
    } else if (formPriorityHigh.checked === true) {
        priorityIn = "high"
    } else {
        priorityIn = 'unchecked';
    }

    const editItem = createNewTodoFactory(newTitle, newDate, priorityIn, newDetails, newChecked, newProject)
    return editItem
}

function populateEditForm(currentTodoBtn) {
    let todoBtn = currentTodoBtn;


    let titleEl = todoBtn.parentElement.parentElement.querySelector(".title");
    let detailsEl = todoBtn.parentElement.parentElement.getAttribute("data-details");
    let projectEl = todoBtn.parentElement.parentElement.getAttribute("data-project");
    let priorityEl = todoBtn.parentElement.parentElement.getAttribute("data-priority");
    let dateEl = todoBtn.parentElement.parentElement.querySelector(".date").innerHTML;

    const formPriorityHigh = document.getElementById("edit-high-priority")
    const formPriorityMed = document.getElementById("edit-med-priority")
    const formPriorityLow = document.getElementById("edit-low-priority")

    let formTitle = document.getElementById("edit-todo-title");

    let formDetails = document.getElementById("edit-todo-details");
    let formDate = document.getElementById("edit-todo-date");
    let formProject = document.getElementById("editSelectProject");

    formTitle.value = titleEl.innerHTML;

    formDetails.value = detailsEl;
    let checkedValue = priorityEl;
    formDate.value = dateEl;

    const selectLabelEl = document.getElementById("select-label")
    if (projectEl === "deleted-project") {
        formProject.value = "no-project"
        selectLabelEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Oops! Looks like this Todo's project was deleted`
        todoBtn.parentElement.parentElement.setAttribute('data-project', 'no-project')
    } else {
        formProject.value = projectEl;
    };
    if (checkedValue === "high") {
        formPriorityHigh.checked = true;
    } else if (checkedValue === "med") {
        formPriorityMed.checked = true;
    } else if (checkedValue === "low") {
        formPriorityLow.checked = true;
    }
}

function openCloseEdit() {
    const editContainerEl = document.querySelector(".popup-edit-container");
    const closeBtn = document.getElementById("closeEdit");
    const mainContainerEl = document.querySelector(".main-container");

    mainContainerEl.classList.add("active")
    editContainerEl.classList.remove("active")
    closeBtn.addEventListener("click", () => {
        mainContainerEl.classList.remove("active");
        editContainerEl.classList.add("active");
        removeHTMLSelectLabel();
        updateLocalStorage();
    });
}

function onSubmit() {
    const formEl = document.getElementById("form")
    formEl.addEventListener("submit", (event) => {
        event.preventDefault();
        addTodo(createTodo);
        closeNewTaskPopup();
        updateLocalStorage();
        refreshLists();
    });
};

function submitsInit() {
    onSubmit();
    onSubmitEdit();
}


export {
    onSubmit,
    createNewTodoFactory,
    editTodo,
    onSubmitEdit,
    submitsInit,
}