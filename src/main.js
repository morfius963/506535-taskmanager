import Menu from './js/components/menu.js';
import Search from './js/components/search.js';
import Filter from './js/components/filter.js';
import BoardController from './js/controllers/board-controller.js';
import Statistics from './js/components/statistics.js';
import SearchController from './js/controllers/search-controller.js';
import {filters as mainFiltersData} from './js/data.js';
import {tasks as mainTasksData} from './js/data.js';
import {renderElement} from './js/utils.js';

const IdValues = {
  TASKS: `control__task`,
  STATISTIC: `control__statistic`,
  NEW_TASK: `control__new-task`
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);

let taskMocks = mainTasksData;

const mainMenu = new Menu();
const mainSearch = new Search();
const mainFilters = new Filter(mainFiltersData);
const mainStatistics = new Statistics();

mainStatistics.getElement().classList.add(`visually-hidden`);

renderElement(menuContainer, mainMenu.getElement(), `beforeend`);
renderElement(mainContainer, mainSearch.getElement(), `beforeend`);
renderElement(mainContainer, mainFilters.getElement(), `beforeend`);
renderElement(mainContainer, mainStatistics.getElement(), `beforeend`);

const boardController = new BoardController(mainContainer);
const onSearchBackButtonClick = () => {
  mainStatistics.getElement().classList.add(`visually-hidden`);
  searchController.hide();
  boardController.show(taskMocks);
};
const searchController = new SearchController(mainContainer, mainSearch, onSearchBackButtonClick);

boardController.show(taskMocks);

mainMenu.getElement().addEventListener(`change`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName.toLowerCase() !== `input`) {
    return;
  }

  switch (evt.target.id) {
    case IdValues.TASKS:
      mainStatistics.hide();
      searchController.hide();
      boardController.show(taskMocks);
      break;
    case IdValues.STATISTIC:
      boardController.hide();
      searchController.hide();
      mainStatistics.show();
      break;
    case IdValues.NEW_TASK:
      boardController.createTask();
      boardController.show(taskMocks);
      mainMenu.getElement().querySelector(`#${IdValues.TASKS}`).checked = true;
      break;
  }
});

mainSearch.getElement().addEventListener(`click`, () => {
  mainStatistics.getElement().classList.add(`visually-hidden`);
  boardController.hide();
  searchController.show(taskMocks);
});
