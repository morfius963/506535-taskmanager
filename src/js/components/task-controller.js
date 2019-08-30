import Task from './task.js';
import TaskEdit from './task-edit.js';
import {renderElement} from '../utils.js';

class TaskController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._taskView = new Task(data);
    this._taskEdit = new TaskEdit(data);

    this._updatedBooleanData = this._buildNewData();

    this.init();
  }

  init() {
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._taskView.getElement()
      .querySelector(`.card__btn--archive`)
      .addEventListener(`click`, (evt) => {
        this._setBooleanValue(evt, `isArchive`);
        this._onDataChange(this._updatedBooleanData, this._data);
      });

    this._taskEdit.getElement()
      .querySelector(`.card__btn--archive`)
      .addEventListener(`click`, (evt) => {
        this._setBooleanValue(evt, `isArchive`);
      });

    this._taskView.getElement()
      .querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, (evt) => {
        this._setBooleanValue(evt, `isFavorite`);
        this._onDataChange(this._updatedBooleanData, this._data);
      });

    this._taskEdit.getElement()
      .querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, (evt) => {
        this._setBooleanValue(evt, `isFavorite`);
      });

    this._taskView.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._onChangeView();

        this._container.getElement().replaceChild(this._taskEdit.getElement(), this._taskView.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement()
      .querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement()
      .querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement()
      .querySelector(`.card__form`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();

        const entry = this._buildNewData();
        this._onDataChange(entry, this._data);

        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    renderElement(this._container.getElement(), this._taskView.getElement(), `beforeend`);
  }

  _setBooleanValue(evt, value) {
    if (evt.currentTarget.classList.contains(`card__btn--disabled`)) {
      evt.currentTarget.classList.remove(`card__btn--disabled`);
      this._updatedBooleanData[value] = false;
    } else {
      evt.currentTarget.classList.add(`card__btn--disabled`);
      this._updatedBooleanData[value] = true;
    }
  }

  _buildNewData() {
    const formData = new FormData(this._taskEdit.getElement().querySelector(`.card__form`));
    const isFavorite = this._taskEdit.getElement().querySelector(`.card__btn--favorites`).classList.contains(`card__btn--disabled`) ? true : false;
    const isArchive = this._taskEdit.getElement().querySelector(`.card__btn--archive`).classList.contains(`card__btn--disabled`) ? true : false;

    const entry = {
      description: formData.get(`text`),
      color: formData.get(`color`),
      tags: new Set([...this._taskEdit.getElement().querySelectorAll(`.card__hashtag-inner`)].map((tag) => (
        tag.querySelector(`.card__hashtag-name`).textContent.trim().substring(1)
      ))),
      dueDate: formData.get(`date`) === `` ? `` : new Date(formData.get(`date`)),
      repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
        acc[it] = true;
        return acc;
      }, {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      }),
      isFavorite,
      isArchive
    };

    console.log(entry.tags);

    return entry;
  }

  setDefaultView() {
    if (this._container.getElement().contains(this._taskEdit.getElement())) {
      this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    }
  }
}

export default TaskController;
