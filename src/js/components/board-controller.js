import BoardContainer from './board-container';
import Sort from './sort.js';
import TaskList from './task-list.js';
import LoadMore from './load-more-button.js';
import NoTasks from './no-tasks.js';
import TaskController from './task-controller';
import {renderElement} from '../utils.js';
import {unrenderElement} from '../utils.js';

class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._boardContainer = new BoardContainer();
    this._sort = new Sort();
    this._taskList = new TaskList();
    this._loadMore = new LoadMore();
    this._noTasks = new NoTasks();
    this._sortedTasks = tasks;

    this._bindedOnLoadBtnClick = this._onLoadBtnClick.bind(this);

    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._RENDER_STEP = 8;
    this._CURRENT_CARDS = 8;
    this._taskLoadState = {
      current: this._CURRENT_CARDS,
      step: this._RENDER_STEP,
      max: this._tasks.length
    };
  }

  get RENDER_STEP() {
    return this._RENDER_STEP;
  }

  set RENDER_STEP(value) {
    this._RENDER_STEP = value;
  }

  get CURRENT_CARDS() {
    return this._CURRENT_CARDS;
  }

  set CURRENT_CARDS(value) {
    this._CURRENT_CARDS = value;
  }

  init() {
    renderElement(this._container, this._boardContainer.getElement(), `beforeend`);

    if (this._tasks.length === 0) {
      renderElement(this._boardContainer.getElement(), this._noTasks.getElement(), `beforeend`);
      return;
    }

    renderElement(this._boardContainer.getElement(), this._sort.getElement(), `beforeend`);
    renderElement(this._boardContainer.getElement(), this._taskList.getElement(), `beforeend`);

    this._tasks.slice(0, this._CURRENT_CARDS).forEach((taskItem) => {
      this._renderTask(taskItem);
    });

    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));

    if (this._tasks.length > this._RENDER_STEP) {
      renderElement(this._boardContainer.getElement(), this._loadMore.getElement(), `beforeend`);
      this._loadMore.getElement().addEventListener(`click`, this._bindedOnLoadBtnClick);
    }
  }

  _renderBoard(tasks) {
    unrenderElement(this._taskList.getElement());
    this._taskList.removeElement();

    renderElement(this._sort.getElement(), this._taskList.getElement(), `afterend`);
    tasks.forEach((taskMock) => this._renderTask(taskMock));
  }

  _replaceOldTask(newTaskMock) {
    const oldTaskIndex = this._sortedTasks.findIndex((it) => it === newTaskMock);
    const oldTask = this._taskList.getElement().children[oldTaskIndex];

    this._renderTask(newTaskMock);

    const changedTask = this._taskList.getElement().children[this._taskList.getElement().children.length - 1];

    oldTask.replaceWith(changedTask);
  }

  _renderTask(task) {
    const taskController = new TaskController(this._taskList, task, this._onDataChange, this._onChangeView);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onDataChange(newData, oldData) {
    this._tasks[this._tasks.findIndex((it) => it === oldData)] = newData;
    this._sortedTasks[this._sortedTasks.findIndex((it) => it === oldData)] = newData;
    this._replaceOldTask(newData);
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
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

    this._renderBoard(this._sortedTasks.slice(0, this._taskLoadState.current));
  }

  _onLoadBtnClick() {
    const current = this._taskLoadState.current;
    const step = current + this._taskLoadState.step;

    this._sortedTasks.slice(current, step).forEach((task) => {
      this._renderTask(task);
    });

    if (step >= this._taskLoadState.max) {
      this._loadMore.getElement().removeEventListener(`click`, this._bindedOnLoadBtnClick);
      unrenderElement(this._loadMore.getElement());
      this._loadMore.removeElement();
      this._taskLoadState.current = this._taskLoadState.max;
    } else {
      this._taskLoadState.current = step;
    }
  }
}

export default BoardController;
