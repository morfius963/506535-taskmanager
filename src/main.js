import {makeMenuTemplate} from './js/components/menu.js';
import {makeSearchTemplate} from './js/components/search.js';
import {makeFilterTemplate} from './js/components/filter.js';
import {makeTaskTemplate} from './js/components/task.js';
import {makeTaskEditTemplate} from './js/components/task-edit.js';
import {makeLoadMoreTemplate} from './js/components/load-more-button.js';
import {makeBoardFilterTemplate} from './js/components/board-filters.js';

import {filters as mainFiltersData} from './js/data.js';
import {tasks as mainTasksData} from './js/data.js';

const menuContainer = document.querySelector(`.main__control`);
const mainSearchContainer = document.querySelector(`.main__search`);
const mainFilterContainer = document.querySelector(`.main__filter`);
const mainContentContainer = document.querySelector(`.board`);
const tasksContainer = document.querySelector(`.board__tasks`);

const taskLoadState = {
  current: 8,
  step: 8,
  max: 20
};

const renderTasks = (container, HTML) => {
  container.insertAdjacentHTML(`beforeend`, HTML);
};

const renderMainFilters = (container) => {
  container.insertAdjacentHTML(`beforeend`, mainFiltersData
    .map(makeFilterTemplate)
    .join(``));
};

const renderComponent = (container, HTML, place) => {
  container.insertAdjacentHTML(place, HTML);
};

const renderMockComponents = () => {
  renderComponent(menuContainer, makeMenuTemplate(), `beforeend`);
  renderComponent(mainSearchContainer, makeSearchTemplate(), `beforeend`);

  renderMainFilters(mainFilterContainer);

  renderComponent(mainContentContainer, makeBoardFilterTemplate(), `afterbegin`);

  renderTasks(tasksContainer, makeTaskEditTemplate(mainTasksData[0]));

  for (let i = 1; i < taskLoadState.current; i++) {
    renderTasks(tasksContainer, makeTaskTemplate(mainTasksData[i]));
  }

  renderComponent(mainContentContainer, makeLoadMoreTemplate(), `beforeend`);
};

renderMockComponents();

const loadMoreBtn = document.querySelector(`.load-more`);
loadMoreBtn.addEventListener(`click`, () => {
  let step = taskLoadState.current + taskLoadState.step;

  for (let i = taskLoadState.current; i < step; i++) {
    renderTasks(tasksContainer, makeTaskTemplate(mainTasksData[i]));

    if (i === taskLoadState.max - 1) {
      loadMoreBtn.remove();
      taskLoadState.current = taskLoadState.max;
      break;
    }
  }

  taskLoadState.current = step;
});
