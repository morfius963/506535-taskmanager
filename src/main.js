import {makeMenuTemplate} from './js/components/menu.js';
import {makeSearchTemplate} from './js/components/search.js';
import {makeFilterTemplate} from './js/components/filter.js';
import {makeTaskTemplate} from './js/components/task.js';
import {makeTaskEditTemplate} from './js/components/task-edit.js';
import {makeLoadMoreTemplate} from './js/components/load-more-button.js';
import {makeBoardContainer} from './js/components/board-container';
import {makeBoardFilterTemplate} from './js/components/board-filters.js';
import {filters as mainFiltersData} from './js/data.js';
import {tasks as mainTasksData} from './js/data.js';

const RENDER_STEP = 8;
const CURRENT_CARDS = 8;

const renderTasks = (container, HTML) => {
  container.insertAdjacentHTML(`beforeend`, HTML);
};

const renderComponent = (container, HTML, place) => {
  container.insertAdjacentHTML(place, HTML);
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);

renderComponent(menuContainer, makeMenuTemplate(), `beforeend`);
renderComponent(mainContainer, makeSearchTemplate(), `beforeend`);
renderComponent(mainContainer, makeFilterTemplate(mainFiltersData), `beforeend`);
renderComponent(mainContainer, makeBoardContainer(), `beforeend`);

const boardFilterContainer = mainContainer.querySelector(`.board`);
const tasksContainer = boardFilterContainer.querySelector(`.board__tasks`);

renderComponent(boardFilterContainer, makeBoardFilterTemplate(), `afterbegin`);
renderTasks(tasksContainer, makeTaskEditTemplate(mainTasksData[0]));

for (let i = 1; i < 8; i++) {
  renderTasks(tasksContainer, makeTaskTemplate(mainTasksData[i]));
}

renderComponent(boardFilterContainer, makeLoadMoreTemplate(), `beforeend`);

const taskLoadState = {
  current: CURRENT_CARDS,
  step: RENDER_STEP,
  max: mainTasksData.length
};

const loadMoreBtn = document.querySelector(`.load-more`);
loadMoreBtn.addEventListener(`click`, () => {
  const step = taskLoadState.current + taskLoadState.step;

  for (let i = taskLoadState.current; i < step; i++) {
    renderTasks(tasksContainer, makeTaskTemplate(mainTasksData[i]));

    if (i === taskLoadState.max - 1) {
      loadMoreBtn.classList.add(`visually-hidden`);
      taskLoadState.current = taskLoadState.max;
      break;
    }
  }

  taskLoadState.current = step;
});
