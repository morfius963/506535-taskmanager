import BoardContainer from '../components/board-container';
import Sort from '../components/sort.js';
import TaskList from '../components/task-list.js';
import LoadMore from '../components/load-more-button.js';
import NoTasks from '../components/no-tasks.js';
import TaskListController from './task-list-controller.js';
import {renderElement} from '../utils';
import {unrenderElement} from '../utils.js';

const TASKS_IN_ROW = 8;

class BoardController {
  constructor(container, onDataChange) {
    this._container = container;
    this._tasks = [];
    this._sortedTasks = [];
    this._onDataChangeMain = onDataChange;

    this._showedTasks = TASKS_IN_ROW;

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
    return this._showedTasks;
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
    unrenderElement(this._loadMore.getElement());
    this._loadMore.removeElement();

    if (this._tasks.length === 0) {
      this._boardContainer.getElement().innerHTML = ``;
      renderElement(this._boardContainer.getElement(), this._noTasks.getElement(), `beforeend`);
      return;
    }

    renderElement(this._boardContainer.getElement(), this._taskList.getElement(), `beforeend`);

    if (this._tasks.length > TASKS_IN_ROW && this._showedTasks < this._tasks.length) {
      renderElement(this._boardContainer.getElement(), this._loadMore.getElement(), `beforeend`);
      this._loadMore.getElement().addEventListener(`click`, this._bindedOnLoadBtnClick);
    }

    this._taskListController.setTasks(this._sortedTasks.slice(0, this._showedTasks), this._sortedTasks.slice(this._showedTasks));
  }

  _setTasks(tasks) {
    this._tasks = tasks;
    this._sortedTasks = tasks;
    this._showedTasks = TASKS_IN_ROW;

    this._renderBoard();
  }

  _onDataChange(tasks) {
    this._tasks = tasks;
    this._sortedTasks = tasks;

    this._onDataChangeMain(tasks);
    this._renderBoard();
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName.toLowerCase() !== `a`) {
      return;
    }

    switch (evt.target.dataset.sortType) {
      case `date-up`:
        const sortedByDateUpTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        this._sortedTasks = sortedByDateUpTasks;
        break;
      case `date-down`:
        const sortedByDateDownTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        this._sortedTasks = sortedByDateDownTasks;
        break;
      case `default`:
        this._sortedTasks = this._tasks;
        break;
    }

    this._taskListController.setTasks(this._sortedTasks.slice(0, this._showedTasks), this._sortedTasks.slice(this._showedTasks));
  }

  _onLoadBtnClick() {
    const step = this._showedTasks + TASKS_IN_ROW;

    this._taskListController.addTasks(this._sortedTasks.slice(this._showedTasks, step));

    this._showedTasks = step;

    if (this._showedTasks >= this._tasks.length) {
      this._loadMore.getElement().removeEventListener(`click`, this._bindedOnLoadBtnClick);
      unrenderElement(this._loadMore.getElement());
      this._loadMore.removeElement();
    }
  }
}

export default BoardController;
