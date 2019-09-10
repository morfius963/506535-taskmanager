import Menu from "./js/components/menu.js";
import Search from "./js/components/search.js";
import Filter from "./js/components/filter.js";
import BoardController from "./js/controllers/board-controller.js";
import Statistics from "./js/components/statistics.js";
import SearchController from "./js/controllers/search-controller.js";
import {filters as mainFiltersData} from "./js/data.js";
import {tasks as mainTasksData} from "./js/data.js";
import {renderElement} from "./js/utils.js";

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

const onDataChange = (tasks) => {
  taskMocks = tasks;
};

// export const onFilterClick = (evt) => {
//   if (evt.target.tagName.toLowerCase() !== `input`) {
//     return;
//   }

//   let filteredTaskMocks = null;

//   switch (evt.target.id) {
//     case IdValues.FILTER_ALL:
//       filteredTaskMocks = taskMocks.filter(({isArchive}) => !isArchive);
//       break;
//     case IdValues.FILTER_OVERDUE:
//       filteredTaskMocks = taskMocks.filter(({dueDate}) => moment(Date.now()).subtract(1, `days`).isAfter(dueDate));
//       break;
//     case IdValues.FILTER_TODAY:
//       filteredTaskMocks = taskMocks.filter(({dueDate}) => new Date(dueDate).toDateString() === new Date(Date.now()).toDateString());
//       break;
//     case IdValues.FILTER_FAVORITES:
//       filteredTaskMocks = taskMocks.filter(({isFavorite}) => isFavorite);
//       break;
//     case IdValues.FILTER_REPEATING:
//       filteredTaskMocks = taskMocks.filter(({repeatingDays}) => Object.keys(repeatingDays).some((day) => repeatingDays[day]));
//       break;
//     case IdValues.FILTER_TAGS:
//       filteredTaskMocks = taskMocks.filter(({tags}) => tags.size > 0);
//       break;
//     case IdValues.FILTER_ARCHIVE:
//       filteredTaskMocks = taskMocks.filter(({isArchive}) => isArchive);
//       break;
//   }

//   boardController.show(filteredTaskMocks);
// };

mainStatistics.getElement().classList.add(`visually-hidden`);

renderElement(menuContainer, mainMenu.getElement(), `beforeend`);
renderElement(mainContainer, mainSearch.getElement(), `beforeend`);
renderElement(mainContainer, mainFilters.getElement(), `beforeend`);
renderElement(mainContainer, mainStatistics.getElement(), `beforeend`);

const boardController = new BoardController(mainContainer, onDataChange);
const onSearchBackButtonClick = () => {
  mainStatistics.hide();
  searchController.hide();
  boardController.show(taskMocks);
};
const searchController = new SearchController(mainContainer, mainSearch, onSearchBackButtonClick, onDataChange);

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
      mainStatistics.hide();
      searchController.hide();
      boardController.show(taskMocks);
      boardController.createTask();
      mainMenu.getElement().querySelector(`#${IdValues.TASKS}`).checked = true;
      break;
  }
});

mainSearch.getElement().addEventListener(`click`, () => {
  mainStatistics.hide();
  boardController.hide();
  searchController.show(taskMocks);
});

mainFilters.getElement().addEventListener(`click`, () => {
  boardController.renderBoard();
});
