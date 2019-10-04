import SearchResult from "../components/search-result.js";
import SearchResultGroup from "../components/search-result-group.js";
import SearchResultInfo from "../components/search-result-info.js";
import SearchNoResult from "../components/search-no-result.js";
import TaskListController from "./task-list-controller.js";
import {renderElement, unrenderElement} from "../utils.js";
import moment from "moment";

class SearchController {
  constructor(container, search, onBackButtonClick, onDataChange) {
    this._container = container;
    this._search = search;
    this._onBackButtonClick = onBackButtonClick;
    this._onDataChangePage = onDataChange;

    this._tasks = [];

    this._searchResult = new SearchResult();
    this._searchResultGroup = new SearchResultGroup();
    this._searchResultInfo = new SearchResultInfo({});
    this._searchNoResult = new SearchNoResult();
    this._taskListController = new TaskListController(
        this._searchResultGroup.getElement().querySelector(`.result__cards`),
        this._onDataChange.bind(this)
    );
  }

  init() {
    this.hide();

    renderElement(this._container, this._searchResult.getElement(), `beforeend`);
    renderElement(this._searchResult.getElement(), this._searchResultGroup.getElement(), `beforeend`);
    renderElement(this._searchResultGroup.getElement(), this._searchResultInfo.getElement(), `afterbegin`);

    this._searchResult.getElement().querySelector(`.result__back`)
      .addEventListener(`click`, () => {
        this._search.getElement().querySelector(`input`).value = ``;
        this._onBackButtonClick();
      });

    this._search.getElement().querySelector(`input`)
      .addEventListener(`keyup`, (evt) => {
        let value = evt.target.value.toLowerCase();
        let tasks = null;

        if (value.length < 3) {
          return;
        }

        switch (value[0]) {
          case `#`:
            value = value.substring(1);
            tasks = this._tasks.filter((task) => {
              return Array.from(task.tags).join(` `).toLowerCase().includes(value.trim());
            });
            break;

          case `D`:
            value = value.substring(1);
            tasks = this._tasks.filter((task) => {
              return moment(task.dueDate).format(`DD.MM.YYYY`).substring(0, value.trim().length) === value.trim();
            });
            break;

          default:
            tasks = this._tasks.filter((task) => {
              return task.description.toLowerCase().includes(value);
            });
        }

        this._showSearchResult(value, tasks);
      });
  }

  hide() {
    this._searchResult.getElement().classList.add(`visually-hidden`);
  }

  show(tasks) {
    this._tasks = tasks;
    this._taskListController.setTasks(tasks, tasks);
    this._searchResultInfo.updateCount(this._tasks.length);

    if (this._searchResult.getElement().classList.contains(`visually-hidden`)) {
      this._showSearchResult(``, tasks);
      this._searchResult.getElement().classList.remove(`visually-hidden`);
    }
  }

  isHidden() {
    return this._searchResult.getElement().classList.contains(`visually-hidden`);
  }

  _showSearchResult(text, tasks) {
    if (this._searchResultInfo) {
      unrenderElement(this._searchResultInfo.getElement());
      this._searchResultInfo.removeElement();
    }

    if (tasks.length === 0) {
      this._searchResultGroup.getElement().querySelector(`.result__cards`).innerHTML = ``;
      unrenderElement(this._searchResultInfo.getElement());
      this._searchResultInfo.removeElement();
      renderElement(this._searchResultGroup.getElement(), this._searchNoResult.getElement(), `afterbegin`);

    } else {
      unrenderElement(this._searchNoResult.getElement());
      this._searchNoResult.removeElement();

      this._searchResultInfo = new SearchResultInfo({title: text, count: tasks.length});
      renderElement(this._searchResultGroup.getElement(), this._searchResultInfo.getElement(), `afterbegin`);
      this._taskListController.setTasks(tasks, tasks);
    }
  }

  _onDataChange(actionType, update) {
    this._onDataChangePage(actionType, update, true);
  }
}

export default SearchController;
