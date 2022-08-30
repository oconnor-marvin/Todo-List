import { updateLocalStorage, updateProjectsLocalStorage } from "./localStorage";
import { createNewTodoFactory, editTodo } from "./taskFunctions";
import { compareAsc, compareDesc, isThisMonth, isThisWeek, isToday, parseISO } from 'date-fns'



function openNewTaskPopup() {
    const newInputPopupEl = document.querySelector(".popup-new-input");
    const mainContainerEl = document.querySelector(".main-container");

    newInputPopupEl.classList.remove('active');
    mainContainerEl.classList.add('active')
};

function clearForm() {
    const formEl = document.getElementById("form").reset();
}

function closeNewTaskPopup() {
    const newInputPopupEl = document.querySelector(".popup-new-input");
    const mainContainerEl = document.querySelector(".main-container");

    newInputPopupEl.classList.add('active');
    mainContainerEl.classList.remove('active');

    clearForm();
};

function clickOpenCloseNewTaskPopup() {
    const newItemBtnEl = document.querySelector(".new-item-btn")
    const closeEl = document.getElementById("closeNew")

    newItemBtnEl.addEventListener("click", () => {
        openNewTaskPopup();
    });
    closeEl.addEventListener("click", () => {
        closeNewTaskPopup();
    });
}

//drop down menu
const dropDownFunctions = (() => {
    const titleSortAZ =
        (a, b) => {
            const nameA = a.title.toUpperCase();
            const nameB = b.title.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            return 0;
        };

    const titleSortZA =
        (a, b) => {
            const nameA = a.title.toUpperCase();
            const nameB = b.title.toUpperCase();
            if (nameA < nameB) {
                return 1;
            }
            if (nameA > nameB) {
                return -1;
            }

            return 0;
        };

    const dateSortSoonest =
        (a, b) => {
            const dateA = parseISO(a.date);
            const dateB = parseISO(b.date);

            return compareAsc(dateA, dateB)
        };

    const dateSortFurthest =
        (a, b) => {
            const dateA = parseISO(a.date);
            const dateB = parseISO(b.date);

            return compareDesc(dateA, dateB)
        };

    const prioritySortUrgent =
        (a, b) => {
            const priorityA = a.priority
            const priorityB = b.priority
            if ((priorityA === "high") && (priorityB === "med")) {
                return -1;
            }
            if ((priorityA === "med") && (priorityB === "high")) {
                return 1;
            }
            if ((priorityA === "med") && (priorityB === "low")) {
                return -1;
            }
            if ((priorityA === "low") && (priorityB === "med")) {
                return 1;
            }
            if ((priorityA === "high") && (priorityB === "low")) {
                return -1;
            }
            if ((priorityA === "low") && (priorityB === "high")) {
                return 1;
            }
            return 0;
        }
    const prioritySortLowest =
        (a, b) => {
            const priorityA = a.priority
            const priorityB = b.priority

            if ((priorityA === "high") && (priorityB === "med")) {
                return 1;
            }
            if ((priorityA === "med") && (priorityB === "high")) {
                return -1;
            }
            if ((priorityA === "med") && (priorityB === "low")) {
                return 1;
            }
            if ((priorityA === "low") && (priorityB === "med")) {
                return -1;
            }
            if ((priorityA === "high") && (priorityB === "low")) {
                return 1;
            }
            if ((priorityA === "low") && (priorityB === "high")) {
                return -1;
            }
            return 0;
        }


    return {
        titleSortAZ,
        titleSortZA,
        dateSortSoonest,
        dateSortFurthest,
        prioritySortUrgent,
        prioritySortLowest,
    }
})();

function deleteListUI() {
    let itemEls = document.querySelectorAll(".item");
    itemEls.forEach(itemEl => {
        itemEl.remove();
    });
}

//select by day week and month
function timeFrameSelection() {
    const homeEl = document.getElementById("home")
    const todayEl = document.getElementById("today")
    const weekEl = document.getElementById("week")
    const monthEl = document.getElementById("month")

    homeEl.addEventListener("click", () => {

        removeTimeFrameClass();
        homeEl.classList.add("selected-time-frame")
        deleteListUI();
        isHomeFn();
        editTodo();
        removeActiveProjects();
    });
    todayEl.addEventListener("click", () => {

        removeTimeFrameClass();
        todayEl.classList.add("selected-time-frame")
        deleteListUI();
        isTodayFn();
        editTodo();
        removeActiveProjects();
    });
    weekEl.addEventListener("click", () => {

        removeTimeFrameClass();
        weekEl.classList.add("selected-time-frame")
        deleteListUI();
        isWeekFn();
        editTodo();
        removeActiveProjects();
    });
    monthEl.addEventListener("click", () => {

        removeTimeFrameClass();
        monthEl.classList.add("selected-time-frame")
        deleteListUI();
        isMonthFn();
        editTodo();
        removeActiveProjects();
    });
}

function dropDownOnChange() {
    document.getElementById("lsOrder").onchange = function () {
        const projectEls = document.querySelectorAll(".project")
        projectEls.forEach(project => {
            if (project.classList.contains("selected")) {
                deleteListUI();
                projectArrays(project.innerHTML);
            }

        });
        const homeEl = document.getElementById("home")
        const todayEl = document.getElementById("today")
        const weekEl = document.getElementById("week")
        const monthEl = document.getElementById("month")

        if (homeEl.classList.contains("selected-time-frame")) {
            removeTimeFrameClass();
            homeEl.classList.add("selected-time-frame")
            deleteListUI();
            isHomeFn()
            editTodo();
            removeActiveProjects();
        } else if (todayEl.classList.contains("selected-time-frame")) {
            removeTimeFrameClass();
            todayEl.classList.add("selected-time-frame")
            deleteListUI();
            isTodayFn();
            editTodo();
            removeActiveProjects();
        } else if (weekEl.classList.contains("selected-time-frame")) {
            removeTimeFrameClass();
            weekEl.classList.add("selected-time-frame")
            deleteListUI();
            isWeekFn();
            editTodo();
            removeActiveProjects();
        } else if (monthEl.classList.contains("selected-time-frame")) {
            removeTimeFrameClass();
            monthEl.classList.add("selected-time-frame")
            deleteListUI();
            isMonthFn();
            editTodo();
            removeActiveProjects();
        }
    }
}


function sortFromDropDown(array) {
    let order = document.getElementById("lsOrder").value;
    if (order == "default") {
        array.sort();
    } else if (order == "a-z") {
        array.sort(dropDownFunctions.titleSortAZ);
    } else if (order == "z-a") {
        array.sort(dropDownFunctions.titleSortZA);
    } else if (order == "date-soonest") {
        array.sort(dropDownFunctions.dateSortSoonest);
    } else if (order == "date-furthest") {
        array.sort(dropDownFunctions.dateSortFurthest);
    } else if (order == "priority-highest") {
        array.sort(dropDownFunctions.prioritySortUrgent);
    } else if (order == "priority-lowest") {
        array.sort(dropDownFunctions.prioritySortLowest);
    }
    return array;
}

function isHomeFn() {
    let list = JSON.parse(localStorage.getItem("list"));
    let homeArr = [];
    let otherArr = [];
    list.forEach(li => {
        homeArr.push(li);
    });
    sortFromDropDown(homeArr);
    timeFrameProjectsRender(homeArr, otherArr);

}

function isTodayFn() {
    let list = JSON.parse(localStorage.getItem("list"));
    let todayArr = [];
    let otherArr = [];
    list.forEach(li => {
        if (isToday(parseISO(li.date))) {
            todayArr.push(li);
        } else {
            otherArr.push(li);
        }
    });
    sortFromDropDown(todayArr);
    timeFrameProjectsRender(todayArr, otherArr);
}

function isWeekFn() {
    let list = JSON.parse(localStorage.getItem("list"));
    let weekArr = [];
    let otherArr = [];
    list.forEach(li => {
        if (isThisWeek(parseISO(li.date))) {
            weekArr.push(li);
        } else {
            otherArr.push(li);
        };
    });
    sortFromDropDown(weekArr);
    timeFrameProjectsRender(weekArr, otherArr);
}

function isMonthFn() {
    let list = JSON.parse(localStorage.getItem("list"));
    let monthArr = [];
    let otherArr = [];
    list.forEach(li => {
        if (isThisMonth(parseISO(li.date))) {
            monthArr.push(li);
        } else {
            otherArr.push(li);
        };
    });
    sortFromDropDown(monthArr);
    timeFrameProjectsRender(monthArr, otherArr);
}

function timeFrameProjectsRender(length, remainder) {
    const todoList = document.getElementById("list");
    const hiddenDiv = document.querySelector(".hidden-div")
    length.forEach((arrEl) => {
        let todayItem = createNewTodoFactory(arrEl.title, arrEl.date, arrEl.priority, arrEl.details, arrEl.checked, arrEl.project);
        todoList.appendChild(todayItem);
    });
    remainder.forEach((remArr) => {
        let leftoverItem = createNewTodoFactory(remArr.title, remArr.date, remArr.priority, remArr.details, remArr.checked, remArr.project);
        hiddenDiv.appendChild(leftoverItem);
    })
}

function removeTimeFrameClass() {
    const homeEl = document.getElementById("home")
    const todayEl = document.getElementById("today")
    const weekEl = document.getElementById("week")
    const monthEl = document.getElementById("month")

    homeEl.classList.remove("selected-time-frame");
    todayEl.classList.remove("selected-time-frame");
    weekEl.classList.remove("selected-time-frame");
    monthEl.classList.remove("selected-time-frame");
}

function removeTimeFrameActive() {
    const homeEl = document.getElementById("home")
    const todayEl = document.getElementById("today")
    const weekEl = document.getElementById("week")
    const monthEl = document.getElementById("month")

    homeEl.classList.remove("selected-time-frame");
    todayEl.classList.remove("selected-time-frame");
    weekEl.classList.remove("selected-time-frame");
    monthEl.classList.remove("selected-time-frame");
}

//projects
function createDropDown() {
    const newDropDown = document.getElementById("createSelectProject");
    const editDropDown = document.getElementById("editSelectProject");

    const projectOptions = document.querySelectorAll(".project");

    const noProjectNew = document.createElement("option");
    noProjectNew.setAttribute('value', "no-project");
    noProjectNew.innerHTML = "No Project";
    newDropDown.appendChild(noProjectNew);
    newDropDown.appendChild(noProjectNew);

    const noProjectEdit = document.createElement("option");
    noProjectEdit.setAttribute('value', "no-project");
    noProjectEdit.innerHTML = "No Project";
    editDropDown.appendChild(noProjectEdit);

    projectOptions.forEach(projectOption => {
        const dropDownNew = document.createElement("option");
        dropDownNew.setAttribute('value', projectOption.innerHTML);
        dropDownNew.innerHTML = projectOption.innerHTML;

        newDropDown.appendChild(dropDownNew);
    });
    projectOptions.forEach(projectOption => {
        const dropDownEdit = document.createElement("option");
        dropDownEdit.setAttribute('value', projectOption.innerHTML);
        dropDownEdit.innerHTML = projectOption.innerHTML;
        editDropDown.appendChild(dropDownEdit);
    });
}

function resetDropDown() {
    const removeChildren = (parent) => {
        while (parent.lastChild) {
            parent.removeChild(parent.lastChild);
        }
    };

    const newDropDown = document.getElementById("createSelectProject");
    const editDropDown = document.getElementById("editSelectProject");

    removeChildren(newDropDown);
    removeChildren(editDropDown);
}

function toggleNewProjectUI() {
    const plusBtnEl = document.getElementById("newProjectBtn");
    const inputSubmitFormEl = document.querySelector(".new-project");


    plusBtnEl.addEventListener("click", () => {
        let projectEls = document.querySelectorAll(".project");
        inputSubmitFormEl.classList.toggle("active");
        plusBtnEl.classList.toggle("active");
    });
}

function submitProjects() {
    const projectList = document.querySelector(".projects");


    const projectSubmit = document.querySelector(".new-project")
    projectSubmit.addEventListener("submit", (event) => {
        const formInput = document.getElementById("newProjectInput").value;
        event.preventDefault();
        const newProjectEl = createProject(formInput);
        projectList.appendChild(newProjectEl);
        updateProjectsLocalStorage();
        closeNewProjectUI();
        resetDropDown();
        createDropDown();
        projectSelection();
        removeProjectFunctionality();
    });
};

function removeDataProjects(projectName) {
    let list = document.querySelectorAll(".item");
    list.forEach(li => {
        let projectData = li.getAttribute("data-project");
        if (projectData === projectName.innerHTML) {
            li.setAttribute('data-project', "deleted-project");
        }
    })
}

function closeNewProjectUI() {
    const plusBtnEl = document.getElementById("newProjectBtn");
    const inputSubmitFormEl = document.querySelector(".new-project");
    const projectEls = document.querySelectorAll(".project");
    const inputAreaEl = document.getElementById("newProjectInput")

    plusBtnEl.classList.remove("active")
    inputSubmitFormEl.classList.add("active")
    inputAreaEl.value = ''
    projectEls.forEach(projectEl => {
        projectEl.classList.remove("active")
    });
};

function createProject(input) {
    const plusBtn = document.getElementById("newProjectBtn")
    const newProject = document.createElement("li");
    newProject.setAttribute("class", "project");
    newProject.innerHTML = input;
    plusBtn.addEventListener("click", () => {
        newProject.classList.toggle("active");
    });

    return newProject;
}

function removeProjectFunctionality() {
    let projects = document.querySelectorAll(".project")
    const homeEl = document.getElementById("home");
    projects.forEach(project => {
        project.addEventListener("click", () => {
            if (project.classList.contains("active")) {
                if (project.classList.contains("selected")) {
                    homeEl.classList.add("selected-time-frame");
                    deleteListUI();
                    isHomeFn();
                    editTodo();
                }
                project.remove();
                removeDataProjects(project);
                resetDropDown();
                createDropDown();
                updateProjectsLocalStorage();
                updateLocalStorage();
            } else {
                return 0;
            }
        })
    })

}

function projectSelection() {
    const projectEls = document.querySelectorAll(".project")

    projectEls.forEach(project => {
        project.addEventListener("click", () => {
            removeActiveProjects();
            removeTimeFrameActive();
            deleteListUI();
            project.classList.add("selected")
            projectArrays(project.innerHTML);
            editTodo();
        });
    });
}


function removeActiveProjects() {
    const projectEls = document.querySelectorAll(".project")

    projectEls.forEach(project => {
        project.classList.remove("selected")
    });
}

function projectArrays(selectedProject) {
    let list = JSON.parse(localStorage.getItem("list"));
    const arrayA = [];
    const arrayB = [];

    list.forEach(li => {
        if (li.project === selectedProject) {
            arrayA.push(li);
        } else {
            arrayB.push(li);
        }
    })
    sortFromDropDown(arrayA)
    timeFrameProjectsRender(arrayA, arrayB);

}

function refreshProjects() {
    const allProjects = document.querySelectorAll(".project");
    let currentProject = '';
    const listItems = document.getElementById("list").childNodes;
    const todoList = document.getElementById("list");
    const hiddenContainer = document.querySelector(".hidden-div");

    allProjects.forEach(project => {
        if (project.classList.contains("selected")) {
            currentProject = project.innerHTML;
        }
    })
    if (currentProject !== '') {
        listItems.forEach(listItem => {
            let listProject = listItem.getAttribute("data-project")
            if (listProject !== currentProject) {
                todoList.removeChild(listItem);
                hiddenContainer.appendChild(listItem);
                updateLocalStorage();
            };
        })
    }
}

function refreshTimeFrame() {
    const TimeFrames = document.querySelectorAll(".timeframe");
    let currentTimeFrame = '';
    const todoList = document.getElementById("list");


    const hiddenContainer = document.querySelector(".hidden-div");

    TimeFrames.forEach(timeframe => {
        if (timeframe.classList.contains("selected-time-frame")) {
            currentTimeFrame = timeframe.innerHTML;
        }
    })
    if (currentTimeFrame === "Today") {
        const listItems = document.getElementById("list").childNodes;
        listItems.forEach(listItem => {
            if (!isToday(parseISO(listItem.querySelector(".date").innerHTML))) {
                todoList.removeChild(listItem);
                hiddenContainer.appendChild(listItem);
            }
        })
    } else if (currentTimeFrame === "Week") {
        const listItems = document.getElementById("list").childNodes;
        listItems.forEach(listItem => {
            if (!isThisWeek(parseISO(listItem.querySelector(".date").innerHTML))) {
                todoList.removeChild(listItem);
                hiddenContainer.appendChild(listItem);
            }
        })
    } else if (currentTimeFrame === "Month") {
        const listItems = document.getElementById("list").childNodes;
        listItems.forEach(listItem => {
            if (!isThisMonth(parseISO(listItem.querySelector(".date").innerHTML))) {
                todoList.removeChild(listItem);
                hiddenContainer.appendChild(listItem);
            }
        })
    }

}

function refreshLists() {
    refreshProjects();
    refreshTimeFrame();
}

function projectsInit() {
    toggleNewProjectUI();
    submitProjects();
    dropDownOnChange();
    createDropDown();
    projectSelection();
    removeProjectFunctionality();
}

export {
    clickOpenCloseNewTaskPopup,
    closeNewTaskPopup,
    deleteListUI,
    timeFrameSelection,
    createProject,
    projectsInit,
    refreshLists,
}