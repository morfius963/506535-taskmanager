import Menu from './js/components/menu.js';
import Search from './js/components/search.js';
import Filter from './js/components/filter.js';
import Task from './js/components/task.js';
import TaskEdit from './js/components/task-edit.js';
import LoadMore from './js/components/load-more-button.js';
import BoardContainer from './js/components/board-container';
import BoardFilters from './js/components/board-filters.js';
import NoTasks from './js/components/no-tasks.js';
import TaskList from './js/components/task-list.js';

import {filters as mainFiltersData} from './js/data.js';
import {tasks as mainTasksData} from './js/data.js';
import {renderElement} from './js/utils.js';

const RENDER_STEP = 8;
const CURRENT_CARDS = 8;

const mainMenu = new Menu();
const mainSearch = new Search();
const mainFilters = new Filter(mainFiltersData);
const boardContainer = new BoardContainer();
const boardFilters = new BoardFilters();
const loadMoreButton = new LoadMore();
const noTasksMessage = new NoTasks();
const tasksList = new TaskList();

const renderTask = (taskMock) => {
  const task = new Task(taskMock);
  const taskEdit = new TaskEdit(taskMock);
  const tasksContainer = document.querySelector(`.board__tasks`);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  task.getElement()
    .querySelector(`.card__btn--edit`)
    .addEventListener(`click`, () => {
      tasksContainer.replaceChild(taskEdit.getElement(), task.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement().querySelector(`textarea`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement().querySelector(`textarea`)
    .addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement()
    .querySelector(`.card__form`)
    .addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      tasksContainer.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  renderElement(tasksContainer, task.getElement(), `beforeend`);
};

const menuContainer = document.querySelector(`.main__control`);
const mainContainer = document.querySelector(`.main`);

const renderMainComponents = () => {
  renderElement(menuContainer, mainMenu.getElement(), `beforeend`);
  renderElement(mainContainer, mainSearch.getElement(), `beforeend`);
  renderElement(mainContainer, mainFilters.getElement(), `beforeend`);
  renderElement(mainContainer, boardContainer.getElement(), `beforeend`);

  const tasksContentElem = document.querySelector(`.board`);

  if (mainTasksData.length === 0) {
    renderElement(tasksContentElem, noTasksMessage.getElement(), `beforeend`);
    return;
  }

  renderElement(tasksContentElem, boardFilters.getElement(), `beforeend`);
  renderElement(tasksContentElem, tasksList.getElement(), `beforeend`);

  mainTasksData.slice(0, CURRENT_CARDS).forEach((task) => {
    renderTask(task);
  });

  if (mainTasksData.length > RENDER_STEP) {
    renderElement(tasksContentElem, loadMoreButton.getElement(), `beforeend`);
  }
};

renderMainComponents();

const taskLoadState = {
  current: CURRENT_CARDS,
  step: RENDER_STEP,
  max: mainTasksData.length
};

const loadMoreBtn = document.querySelector(`.load-more`);

const onLoadBtnClick = () => {
  const current = taskLoadState.current;
  const step = current + taskLoadState.step;

  mainTasksData.slice(current, step).forEach((task) => {
    renderTask(task);
  });

  if (step >= taskLoadState.max) {
    loadMoreBtn.removeEventListener(`click`, onLoadBtnClick);
    loadMoreBtn.classList.add(`visually-hidden`);
    taskLoadState.current = taskLoadState.max;
  } else {
    taskLoadState.current = step;
  }
};

if (loadMoreBtn) {
  loadMoreBtn.addEventListener(`click`, onLoadBtnClick);
}
