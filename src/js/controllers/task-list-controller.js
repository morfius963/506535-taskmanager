import TaskController, {Mode as TaskControllerMode} from "./task-controller.js";
import {unrenderElement} from "../utils.js";

class TaskListController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;

    this._creatingTask = null;
    this._showedTasksCount = null;
    this._subscriptions = [];
    this._tasks = [];

    this.onChangeView = this.onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  setTasks(viewedTasks, allTasks) {
    this._tasks = allTasks;
    this._subscriptions = [];
    this._creatingTask = null;
    this._showedTasksCount = viewedTasks.length;

    this._container.innerHTML = ``;
    viewedTasks.forEach((task) => this._renderTask(task));
  }

  addTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
    this._showedTasksCount += tasks.length;
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const defaultTask = {
      description: ``,
      dueDate: new Date().toISOString(),
      tags: new Set(),
      color: ``,
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      },
      isFavorite: false,
      isArchive: false,
    };

    this.onChangeView();
    this._creatingTask = new TaskController(this._container, defaultTask, TaskControllerMode.ADDING, this.onChangeView, (...args) => {
      this._creatingTask = null;
      this._onDataChange(...args);
    });
  }

  onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());

    if (this._container.children.length > this._showedTasksCount) {
      unrenderElement(this._container.children[0]);
      this._creatingTask = null;
    }
  }

  _onDataChange(actionType, update, onError) {
    this._creatingTask = null;
    this._onDataChangeMain(actionType, update, false, onError);
  }

  _renderTask(task) {
    const taskController = new TaskController(this._container, task, TaskControllerMode.DEFAULT, this.onChangeView, this._onDataChange);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }
}

export default TaskListController;
