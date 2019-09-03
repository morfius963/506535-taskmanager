import SearchResult from '../components/search-result.js';
import SearchResultGroup from '../components/search-result-group.js';
import SearchResultInfo from "../components/search-result-info.js";
import TaskListController from "./task-list-controller.js";
import {renderElement, unrenderElement} from '../utils.js';

class SearchController {
  constructor(container, search, onBackButtonClick) {
    this._container = container;
    this._search = search;
    this._onBackButtonClick = onBackButtonClick;

    this._tasks = [];

    this._searchResult = new SearchResult();
    this._searchResultGroup = new SearchResultGroup();
    this._searchResultInfo = new SearchResultInfo({});
    this._taskListController = new TaskListController(
        this._searchResultGroup.getElement().querySelector(`.result__cards`),
        this._onDataChange.bind(this),
        () => 8
    );

    this._init();
  }

  _init() {
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
        const {value} = evt.target;
        const tasks = this._tasks.filter((task) => {
          return task.description.includes(value);
        });

        this._showSearchResult(value, tasks);
      });
  }

  hide() {
    this._searchResult.getElement().classList.add(`visually-hidden`);
  }

  show(tasks) {
    this._tasks = tasks;

    if (this._searchResult.getElement().classList.contains(`visually-hidden`)) {
      this._showSearchResult(``, this._tasks);
      this._searchResult.getElement().classList.remove(`visually-hidden`);
    }
  }

  _showSearchResult(text, tasks) {
    if (this._searchResultInfo) {
      unrenderElement(this._searchResultInfo.getElement());
      this._searchResultInfo.removeElement();
    }

    this._searchResultInfo = new SearchResultInfo({title: text, count: tasks.length});

    renderElement(this._searchResultGroup.getElement(), this._searchResultInfo.getElement(), `afterbegin`);

    this._taskListController.setTasks(tasks);
  }

  _onDataChange(tasks) {
    this._tasks = tasks;
  }
}

export default SearchController;
