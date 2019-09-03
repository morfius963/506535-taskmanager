import TaskController, {Mode as TaskControllerMode} from './task-controller.js';
import {unrenderElement} from '../utils.js';

class TaskListController {
  constructor(container, onDataChange, getCount) {
    this._container = container;
    this._onDataChangeMain = onDataChange;
    // функція для того, щоб ми завжди знали, скільки актуальну кількість тасків, які треба вивести
    this._getCurrentTasks = getCount;

    this._creatingTask = null;
    this._subscriptions = [];
    this._tasks = [];
    this._sortedTasks = [];

    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  setTasks(tasks) {
    this._tasks = tasks;
    this._sortedTasks = tasks;
    this._subscriptions = [];

    this._container.innerHTML = ``;
    this._tasks.slice(0, this._getCurrentTasks()).forEach((task) => this._renderTask(task));
  }

  addTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
    this._tasks = this._tasks.concat(tasks);
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

    this._onChangeView();
    this._creatingTask = new TaskController(this._container, defaultTask, TaskControllerMode.ADDING, this._onChangeView, (...args) => {
      this._creatingTask = null;
      this._onDataChange(...args);
    });
  }

  _renderTask(task) {
    const taskController = new TaskController(this._container, task, TaskControllerMode.DEFAULT, this._onChangeView, this._onDataChange);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onChangeView() {
    let counter = 0;
    let elemToRemove = null;

    this._subscriptions.forEach((subscription) => {
      subscription();
      counter += 1;
    });

    // якщо ми відкрили форму редагування, коли на сторінці вже є новий незбережений таск (доданий через  add new task), то цей новий таск видаляємо
    if (this._container.children.length > counter) {
      elemToRemove = this._container.children[0];
      unrenderElement(elemToRemove);
      this._creatingTask = null;
    }
  }

  _onDataChange(newData, oldData) {
    const tasksIndex = this._tasks.findIndex((it) => it === oldData);
    const sortedTasksIndex = this._sortedTasks.findIndex((it) => it === oldData);

    // якщо ми нажали Add new Task і потім його не зберегли, то просто видалити елемент без зміни даних
    if (newData === null && oldData === null) {
      this._creatingTask = null;
      return;

    } else if (oldData === null) {
      this._tasks = [newData, ...this._tasks];
      this._sortedTasks = [newData, ...this._sortedTasks];
      this._creatingTask = null;

    } else if (newData === null) {
      this._tasks = [...this._tasks.slice(0, tasksIndex), ...this._tasks.slice(tasksIndex + 1)];
      this._sortedTasks = [...this._sortedTasks.slice(0, sortedTasksIndex), ...this._sortedTasks.slice(sortedTasksIndex + 1)];
      this._creatingTask = null;

    } else {
      this._tasks[tasksIndex] = newData;
      this._sortedTasks[sortedTasksIndex] = newData;
    }

    this.setTasks(this._sortedTasks);
    this._onDataChangeMain(this._sortedTasks);
  }
}

export default TaskListController;
