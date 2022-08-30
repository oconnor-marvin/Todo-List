import { createNewTodoFactory } from "./taskFunctions"
import { createProject } from "./UI"

function updateLocalStorage() {
    const liEls = document.querySelectorAll(".item")
    let list = [];
    liEls.forEach(liEl => {
        list.push({
            title: liEl.firstChild.firstChild.innerHTML,
            date: liEl.querySelector(".date").innerHTML,
            priority: liEl.getAttribute("data-priority"),
            details: liEl.getAttribute("data-details"),
            project: liEl.getAttribute("data-project"),
            checked: liEl.classList.contains("checked")
        });
    });
    localStorage.setItem("list", JSON.stringify(list))
}

function renderList(sortFunction) {
    const todoList = document.getElementById("list");
    let list = JSON.parse(localStorage.getItem("list"));
    if (list) {
        list.sort(sortFunction);
        list.forEach((liEl) => {
            let newLiEL = createNewTodoFactory(liEl.title, liEl.date, liEl.priority, liEl.details, liEl.checked, liEl.project);
            todoList.appendChild(newLiEL);
        });
    }
}

function updateProjectsLocalStorage() {
    const projectEls = document.querySelectorAll(".project")
    let projectLs = [];
    projectEls.forEach(project => {
        projectLs.push({
            projectName: project.innerHTML,
        });
    });
    localStorage.setItem("projectLs", JSON.stringify(projectLs))
}

function renderProjectsList() {
    const projectListContainer = document.querySelector(".projects")
    let projectLs = JSON.parse(localStorage.getItem("projectLs"));
    if (projectLs) {
        projectLs.forEach((project) => {
            let newProjectEl = createProject(project.projectName);
            projectListContainer.appendChild(newProjectEl);
        });
    }

}

function rendersInit() {
    renderList();
    renderProjectsList();
}

export {
    updateLocalStorage,
    renderList,
    updateProjectsLocalStorage,
    renderProjectsList,
    rendersInit,
}