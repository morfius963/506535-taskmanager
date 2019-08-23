import Menu from './js/components/menu.js';
import Search from './js/components/search.js';
import Filter from './js/components/filter.js';
import BoardController from './js/components/board-controller.js';
import {filters as mainFiltersData} from './js/data.js';
import {tasks as mainTasksData} from './js/data.js';
import {renderElement} from './js/utils.js';

const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);

const mainMenu = new Menu();
const mainSearch = new Search();
const mainFilters = new Filter(mainFiltersData);
const boardController = new BoardController(mainContainer, mainTasksData);

const renderPage = () => {
  renderElement(menuContainer, mainMenu.getElement(), `beforeend`);
  renderElement(mainContainer, mainSearch.getElement(), `beforeend`);
  renderElement(mainContainer, mainFilters.getElement(), `beforeend`);
  boardController.init();
};

renderPage();
