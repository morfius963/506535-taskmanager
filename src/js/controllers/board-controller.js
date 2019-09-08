import BoardContainer from "../components/board-container";
import Sort from "../components/sort.js";
import TaskList from "../components/task-list.js";
import LoadMore from "../components/load-more-button.js";
import NoTasks from "../components/no-tasks.js";
import TaskListController from "./task-list-controller.js";
import {renderElement, unrenderElement, sortByValue} from "../utils";

const TASKS_IN_ROW = 8;

class BoardController {
  constructor(container, onDataChange) {
    this._container = container;
    this._tasks = [];
    this._onDataChangeMain = onDataChange;

    this._showedTasksCount = TASKS_IN_ROW;

    this._boardContainer = new BoardContainer();
    this._sort = new Sort();
    this._taskList = new TaskList();
    this._loadMore = new LoadMore();
    this._noTasks = new NoTasks();
    this._taskListController = new TaskListController(this._taskList.getElement(), this._onDataChange.bind(this), this.getShowedTasks.bind(this));

    this._bindedOnLoadBtnClick = this._onLoadBtnClick.bind(this);

    this._init();
  }

  _init() {
    renderElement(this._container, this._boardContainer.getElement(), `beforeend`);
    renderElement(this._boardContainer.getElement(), this._sort.getElement(), `beforeend`);
    renderElement(this._boardContainer.getElement(), this._taskList.getElement(), `beforeend`);

    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

    if (this._tasks.length > TASKS_IN_ROW) {
      renderElement(this._boardContainer.getElement(), this._loadMore.getElement(), `beforeend`);
      this._loadMore.getElement().addEventListener(`click`, this._bindedOnLoadBtnClick);
    }
  }

  getShowedTasks() {
    return this._showedTasksCount;
  }

  show(tasks) {
    if (tasks !== this._tasks) {
      this._setTasks(tasks);
    }

    this._boardContainer.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._taskListController.onChangeView();
    this._boardContainer.getElement().classList.add(`visually-hidden`);
  }

  createTask() {
    if (this._tasks.length === 0) {
      this._boardContainer.getElement().innerHTML = ``;
      renderElement(this._boardContainer.getElement(), this._sort.getElement(), `beforeend`);
      renderElement(this._boardContainer.getElement(), this._taskList.getElement(), `beforeend`);
    }

    this._taskListController.createTask();
  }

  _renderBoard() {
    const sortedTasks = this._sortByCurrentSortValue(this._tasks);

    unrenderElement(this._loadMore.getElement());
    this._loadMore.removeElement();

    if (this._tasks.length === 0) {
      this._boardContainer.getElement().innerHTML = ``;
      renderElement(this._boardContainer.getElement(), this._noTasks.getElement(), `beforeend`);
      return;
    }

    renderElement(this._boardContainer.getElement(), this._taskList.getElement(), `beforeend`);

    if (this._tasks.length > TASKS_IN_ROW && this._showedTasksCount < this._tasks.length) {
      renderElement(this._boardContainer.getElement(), this._loadMore.getElement(), `beforeend`);
      this._loadMore.getElement().addEventListener(`click`, this._bindedOnLoadBtnClick);
    }

    this._taskListController.setTasks(sortedTasks.slice(0, this._showedTasksCount), sortedTasks.slice(this._showedTasksCount));
  }

  _setTasks(tasks) {
    this._tasks = tasks;
    this._showedTasksCount = TASKS_IN_ROW;

    this._renderBoard();
  }

  _onDataChange(tasks) {
    this._tasks = tasks;

    this._onDataChangeMain(tasks);
    this._renderBoard();
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName.toLowerCase() !== `a`) {
      return;
    }

    let sortedTasks = null;

    switch (evt.target.dataset.sortType) {
      case `date-up`:
        sortedTasks = sortByValue(this._tasks, `up`);
        break;
      case `date-down`:
        sortedTasks = sortByValue(this._tasks, `down`);
        break;
      case `default`:
        sortedTasks = sortByValue(this._tasks, `default`);
        break;
    }

    this._sort.getElement().querySelectorAll(`.board__filter`).forEach((sortItem) => sortItem.classList.remove(`board__filter--active`));
    evt.target.classList.add(`board__filter--active`);
    this._taskListController.setTasks(sortedTasks.slice(0, this._showedTasksCount), sortedTasks.slice(this._showedTasksCount));
  }

  _onLoadBtnClick() {
    const step = this._showedTasksCount + TASKS_IN_ROW;
    const sortedTasks = this._sortByCurrentSortValue(this._tasks);

    this._taskListController.addTasks(sortedTasks.slice(this._showedTasksCount, step));

    this._showedTasksCount = step;

    if (this._showedTasksCount >= this._tasks.length) {
      this._loadMore.getElement().removeEventListener(`click`, this._bindedOnLoadBtnClick);
      unrenderElement(this._loadMore.getElement());
      this._loadMore.removeElement();
    }
  }

  _sortByCurrentSortValue(tasks) {
    const current = Array.from(this._sort.getElement().querySelectorAll(`.board__filter`)).find((sortItem) => sortItem.classList.contains(`board__filter--active`)).dataset.sortType;

    switch (current) {
      case `date-up`:
        return sortByValue(tasks, `up`);
      case `date-down`:
        return sortByValue(tasks, `down`);
    }

    return sortByValue(tasks, `default`);
  }
}

export default BoardController;
