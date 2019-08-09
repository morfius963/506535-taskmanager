import {makeMenuTemplate} from './js/components/menu.js';
import {makeSearchTemplate} from './js/components/search.js';
import {makeFilterTemplate} from './js/components/filter.js';
import {makeTaskTemplate} from './js/components/task.js';
import {makeTaskEditTemplate} from './js/components/task-edit.js';
import {makeLoadMoreTemplate} from './js/components/load-more-button.js';
import {makeBoardTemplate} from './js/components/board-container.js';
import {makeBoardFilterTemplate} from './js/components/board-filters.js';

const CARDS_COUNT = 3;

const renderComponent = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);

const renderMockComponents = () => {
  renderComponent(menuContainer, makeMenuTemplate(), `beforeend`);
  renderComponent(mainContainer, makeSearchTemplate(), `beforeend`);
  renderComponent(mainContainer, makeFilterTemplate(), `beforeend`);
  renderComponent(mainContainer, makeBoardTemplate(), `beforeend`);

  const boardContainer = mainContainer.querySelector(`.board`);
  const taskListContainer = mainContainer.querySelector(`.board__tasks`);

  renderComponent(boardContainer, makeBoardFilterTemplate(), `afterbegin`);
  renderComponent(taskListContainer, makeTaskEditTemplate(), `beforeend`);

  for (let i = 1; i <= CARDS_COUNT; i++) {
    renderComponent(taskListContainer, makeTaskTemplate(), `beforeend`);
  }

  renderComponent(boardContainer, makeLoadMoreTemplate(), `beforeend`);
};

renderMockComponents();
