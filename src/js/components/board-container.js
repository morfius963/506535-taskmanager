import {createElement} from '../utils.js';
import {removeElem} from '../utils.js';

class BoardContainer {
  constructor(tasks) {
    this._tasks = tasks;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    removeElem(this._element);
    this._element = null;
  }

  hasTasks() {
    return this._tasks.filter(({isArchive}) => !isArchive).length !== 0;
  }

  getTemplate() {
    return `<section class="board container">
      ${this.hasTasks()
    ? `<div class="board__tasks">
      </div>`
    : `<p class="board__no-tasks">
        Congratulations, all tasks were completed! To create a new click on «add new task» button.
      </p>`}
    </section>`;
  }
}

export default BoardContainer;
