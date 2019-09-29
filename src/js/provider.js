import ModelTask from "./model-task.js";
import {objectToArray} from "./utils.js";

class Provider {
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
  }

  getTasks() {
    if (Provider.isOnline()) {
      return this._api.getTasks()
      .then((tasks) => {
        tasks.map((it) => this._store.setItem({key: it.id, item: it.toRAW()}));
        return tasks;
      });
    }

    const rawTasksMap = this._store.getAll();
    const rawTasks = objectToArray(rawTasksMap);
    const tasks = ModelTask.parseTasks(rawTasks);

    return Promise.resolve(tasks);
  }

  createTask({task}) {
    if (Provider.isOnline()) {
      return this._api.createTask({task})
      .then((taskItem) => {
        this._store.setItem({key: taskItem.id, item: taskItem.toRAW()});
        return taskItem;
      });
    }

    task.id = this._generateId();

    this._store.setItem({key: task.id, item: task});
    return Promise.resolve(ModelTask.parseTask(task));
  }

  updateTask({id, data}) {
    if (Provider.isOnline()) {
      return this._api.updateTask({id, data})
      .then((task) => {
        this._store.setItem({key: task.id, item: task.toRAW()});
        return task;
      });
    }

    const task = data;
    this._store.setItem({key: task.id, item: task});
    return Promise.resolve(ModelTask.parseTask(task));
  }

  deleteTask({id}) {
    if (Provider.isOnline()) {
      return this._api.deleteTask({id})
      .then(() => {
        this._store.removeItem({key: id});
      });
    }

    this._store.removeItem({key: id});
    return Promise.resolve(true);
  }

  syncTasks() {
    return this._api.syncTasks({tasks: objectToArray(this._store.getAll())});
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}

export default Provider;
