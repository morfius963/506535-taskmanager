import TaskController, {Mode as TaskControllerMode} from "./task-controller.js";
import PageDataController from "./page-data-controller.js";
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

    this._pageDataController = new PageDataController();
  }

  setTasks(viewedTasks, unViewedTasks = []) {
    this._tasks = [...viewedTasks, ...unViewedTasks];
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
      dueDate: new Date(),
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

  _renderTask(task) {
    const taskController = new TaskController(this._container, task, TaskControllerMode.DEFAULT, this.onChangeView, this._onDataChange);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());

    if (this._container.children.length > this._showedTasksCount) {
      unrenderElement(this._container.children[0]);
      this._creatingTask = null;
    }
  }

  _onDataChange(newData, oldData) {
    const tasksIndex = this._tasks.findIndex((it) => it === oldData);

    // якщо ми нажали Add new Task і потім його не зберегли, то просто видалити елемент без зміни даних
    if (newData === null && oldData === null) {
      this._onDataChangeMain(this._tasks);
      this._creatingTask = null;
      return;

    } else if (oldData === null) {
      this._tasks = [newData, ...this._tasks];

    } else if (newData === null) {
      this._tasks = [...this._tasks.slice(0, tasksIndex), ...this._tasks.slice(tasksIndex + 1)];

    } else {
      this._tasks[tasksIndex] = newData;
    }

    this._creatingTask = null;
    this._pageDataController.updateFilter(this._tasks);
    this._onDataChangeMain(this._tasks);
  }
}

export default TaskListController;
