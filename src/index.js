import {clickOpenCloseNewTaskPopup,projectsInit, timeFrameSelection} from "./UI"
import { editTodo, submitsInit} from "./taskFunctions"
import { rendersInit } from "./localStorage"


init();

function init(){
    clickOpenCloseNewTaskPopup();
    timeFrameSelection();
    submitsInit();
    rendersInit();
    projectsInit();
    editTodo();
};