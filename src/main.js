import Menu from "./js/components/menu.js";
import Search from "./js/components/search.js";
import Filters from "./js/components/filter.js";
import BoardController from "./js/controllers/board-controller.js";
import Statistics from "./js/components/statistics.js";
import LoadingMessage from "./js/components/loading-message.js";
import SearchController from "./js/controllers/search-controller.js";
import PageDataController from "./js/controllers/page-data-controller.js";
import API from "./js/api.js";
import {renderElement, getFilterData, unrenderElement} from "./js/utils.js";

const IdValues = {
  TASKS: `control__task`,
  STATISTIC: `control__statistic`,
  NEW_TASK: `control__new-task`
};
const FILTER_NAMES = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];
const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/task-manager`;

const mainContainer = document.querySelector(`.main`);
const menuContainer = document.querySelector(`.main__control`);

let taskMainData = null;
let filterMainData = null;

const onDataChange = (actionType, update, isSearch = false, onError) => {
  if (actionType === null || update === null) {
    boardController.renderBoard();
    return;
  }

  switch (actionType) {
    case `update`:
      api.updateTask({
        id: update.id,
        data: update.toRAW()
      })
        .then(() => api.getTasks())
        .then((tasks) => {
          taskMainData = tasks;
          pageDataController.updateFilter(tasks);
          if (isSearch) {
            searchController.show(tasks);
          } else {
            boardController.show(tasks);
          }
        })
        .catch(() => {
          onError();
        });
      break;
    case `delete`:
      api.deleteTask({
        id: update.id
      })
        .then(() => api.getTasks())
        .then((tasks) => {
          taskMainData = tasks;
          pageDataController.updateFilter(tasks);
          if (isSearch) {
            searchController.show(tasks);
          } else {
            boardController.show(tasks);
          }
        })
        .catch(() => {
          onError();
        });
      break;
    case `create`:
      api.createTask({
        task: update.toRAW()
      })
        .then(() => api.getTasks())
        .then((tasks) => {
          taskMainData = tasks;
          boardController.show(tasks);
          pageDataController.updateFilter(tasks);
        })
        .catch(() => {
          onError();
        });
  }
};

const onSearchBackButtonClick = () => {
  mainStatistics.hide();
  searchController.hide();
  boardController.show(taskMainData);
};

const mainMenu = new Menu();
const mainSearch = new Search();
const mainFilters = new Filters();
const mainStatistics = new Statistics();
const loadingMessage = new LoadingMessage();

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const boardController = new BoardController(mainContainer, onDataChange);
const searchController = new SearchController(mainContainer, mainSearch, onSearchBackButtonClick, onDataChange);
const pageDataController = new PageDataController();

mainStatistics.getElement().classList.add(`visually-hidden`);

renderElement(menuContainer, mainMenu.getElement(), `beforeend`);
renderElement(mainContainer, mainSearch.getElement(), `beforeend`);
renderElement(mainContainer, Filters.getMockElement(), `beforeend`);
renderElement(mainContainer, mainStatistics.getElement(), `beforeend`);
renderElement(mainContainer, loadingMessage.getElement(), `beforeend`);

api.getTasks()
  .then((tasks) => {
    taskMainData = tasks;
    filterMainData = FILTER_NAMES.map((filter) => getFilterData(filter, tasks));
  })
  .then(() => {
    mainFilters.setFilterData(filterMainData);
    mainFilters.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName.toLowerCase() !== `input`) {
        return;
      }
      boardController.renderBoard();
    });
    document.querySelector(`.main__filter`).replaceWith(mainFilters.getElement());
  })
  .then(() => {
    unrenderElement(loadingMessage.getElement());
    loadingMessage.removeElement();
    boardController.init();
    searchController.init();
    boardController.show(taskMainData);
  });

mainMenu.getElement().addEventListener(`change`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName.toLowerCase() !== `input`) {
    return;
  }

  switch (evt.target.id) {
    case IdValues.TASKS:
      mainStatistics.hide();
      searchController.hide();
      boardController.show(taskMainData);
      break;
    case IdValues.STATISTIC:
      boardController.hide();
      searchController.hide();
      mainStatistics.show(taskMainData);
      break;
    case IdValues.NEW_TASK:
      mainStatistics.hide();
      searchController.hide();
      boardController.show(taskMainData);
      boardController.createTask();
      mainMenu.getElement().querySelector(`#${IdValues.TASKS}`).checked = true;
      break;
  }
});
