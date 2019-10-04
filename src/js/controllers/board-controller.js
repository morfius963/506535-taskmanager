import BoardContainer from "../components/board-container";
import Sort from "../components/sort.js";
import TaskList from "../components/task-list.js";
import LoadMore from "../components/load-more-button.js";
import NoTasks from "../components/no-tasks.js";
import TaskListController from "./task-list-controller.js";
import {renderElement, unrenderElement, sortByValue} from "../utils.js";
import moment from "moment";

const TASKS_IN_ROW = 8;
const FilterId = {
  ALL: `filter__all`,
  OVERDUE: `filter__overdue`,
  TODAY: `filter__today`,
  FAVORITES: `filter__favorites`,
  REPEATING: `filter__repeating`,
  TAGS: `filter__tags`,
  ARCHIVE: `filter__archive`
};

class BoardController {
  constructor(container, onDataChange) {
    this._container = container;
    this._tasks = [];
    this._onDataChange = onDataChange;

    this._showedTasksCount = TASKS_IN_ROW;

    this._boardContainer = new BoardContainer();
    this._sort = new Sort();
    this._taskList = new TaskList();
    this._loadMore = new LoadMore();
    this._noTasks = new NoTasks();
    this._taskListController = new TaskListController(this._taskList.getElement(), this._onDataChange);

    this._bindedOnLoadBtnClick = this._onLoadBtnClick.bind(this);
  }

  init() {
    renderElement(this._container, this._boardContainer.getElement(), `beforeend`);
    renderElement(this._boardContainer.getElement(), this._sort.getElement(), `beforeend`);
    renderElement(this._boardContainer.getElement(), this._taskList.getElement(), `beforeend`);

    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

    if (this._tasks.length > TASKS_IN_ROW) {
      renderElement(this._boardContainer.getElement(), this._loadMore.getElement(), `beforeend`);
      this._loadMore.getElement().addEventListener(`click`, this._bindedOnLoadBtnClick);
    }
  }

  show(tasks = null) {
    if (tasks !== this._tasks && tasks !== null) {
      this._setTasks(tasks);
    }

    this._boardContainer.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._taskListController.onChangeView();
    this._boardContainer.getElement().classList.add(`visually-hidden`);
  }

  createTask() {
    if (this._showedTasksCount === 0) {
      unrenderElement(this._noTasks.getElement());
      this._noTasks.removeElement();
      renderElement(this._boardContainer.getElement(), this._sort.getElement(), `beforeend`);
      renderElement(this._boardContainer.getElement(), this._taskList.getElement(), `beforeend`);
      this._taskList.getElement().innerHTML = ``;
    }

    this._taskListController.createTask();
  }

  renderBoard() {
    const sortedTasks = this._sortByCurrentValue(this._tasks);

    unrenderElement(this._loadMore.getElement());
    this._loadMore.removeElement();
    this._showedTasksCount = Math.min(sortedTasks.length, TASKS_IN_ROW);

    if (sortedTasks.length === 0) {
      unrenderElement(this._sort.getElement());
      unrenderElement(this._taskList.getElement());
      renderElement(this._boardContainer.getElement(), this._noTasks.getElement(), `beforeend`);
      return;
    }

    if (!Array.from(this._boardContainer.getElement().children).includes(this._sort.getElement())) {
      renderElement(this._boardContainer.getElement(), this._sort.getElement(), `beforeend`);
      unrenderElement(this._noTasks.getElement());
      this._noTasks.removeElement();
    }

    renderElement(this._boardContainer.getElement(), this._taskList.getElement(), `beforeend`);

    if (this._tasks.length > TASKS_IN_ROW && this._showedTasksCount < sortedTasks.length) {
      renderElement(this._boardContainer.getElement(), this._loadMore.getElement(), `beforeend`);
      this._loadMore.getElement().addEventListener(`click`, this._bindedOnLoadBtnClick);
    }

    this._taskListController.setTasks(sortedTasks.slice(0, this._showedTasksCount), this._tasks);
  }

  _setTasks(tasks) {
    this._tasks = tasks;
    this._showedTasksCount = TASKS_IN_ROW;

    this.renderBoard();
  }

  _sortByCurrentValue(tasks) {
    const currentSort = Array.from(this._sort.getElement().querySelectorAll(`.board__filter`)).find((sortItem) => sortItem.classList.contains(`board__filter--active`)).dataset.sortType;
    const currentFilter = Array.from(document.querySelectorAll(`.filter__input`)).find((filter) => filter.checked).id;
    let result = null;

    switch (currentSort) {
      case `date-up`:
        result = sortByValue(tasks, `up`);
        break;
      case `date-down`:
        result = sortByValue(tasks, `down`);
        break;
      case `default`:
        result = sortByValue(tasks, `default`);
        break;
    }

    switch (currentFilter) {
      case FilterId.ALL:
        result = result.filter(({isArchive}) => !isArchive);
        break;
      case FilterId.OVERDUE:
        result = result.filter(({dueDate}) => moment(Date.now()).subtract(1, `days`).isAfter(dueDate));
        break;
      case FilterId.TODAY:
        result = result.filter(({dueDate}) => new Date(dueDate).toDateString() === new Date(Date.now()).toDateString());
        break;
      case FilterId.FAVORITES:
        result = result.filter(({isFavorite}) => isFavorite);
        break;
      case FilterId.REPEATING:
        result = result.filter(({repeatingDays}) => Object.keys(repeatingDays).some((day) => repeatingDays[day]));
        break;
      case FilterId.TAGS:
        result = result.filter(({tags}) => tags.size > 0);
        break;
      case FilterId.ARCHIVE:
        result = result.filter(({isArchive}) => isArchive);
        break;
    }

    return result;
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName.toLowerCase() !== `a`) {
      return;
    }

    this._sort.getElement().querySelectorAll(`.board__filter`).forEach((sortItem) => sortItem.classList.remove(`board__filter--active`));
    evt.target.classList.add(`board__filter--active`);

    const sortedTasks = this._sortByCurrentValue(this._tasks);

    this._taskListController.setTasks(sortedTasks.slice(0, this._showedTasksCount), this._tasks);
  }

  _onLoadBtnClick() {
    const step = this._showedTasksCount + TASKS_IN_ROW;
    const sortedTasks = this._sortByCurrentValue(this._tasks);

    this._taskListController.addTasks(sortedTasks.slice(this._showedTasksCount, step));

    this._showedTasksCount = step;

    if (this._showedTasksCount >= this._tasks.length) {
      this._loadMore.getElement().removeEventListener(`click`, this._bindedOnLoadBtnClick);
      unrenderElement(this._loadMore.getElement());
      this._loadMore.removeElement();
    }
  }
}

export default BoardController;
