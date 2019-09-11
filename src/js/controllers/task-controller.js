import Task from "../components/task.js";
import TaskEdit from "../components/task-edit.js";
import {renderElement, unrenderElement} from "../utils.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

class TaskController {
  constructor(container, data, mode, onChangeView, onDataChange) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._taskView = new Task(data);
    this._taskEdit = new TaskEdit(data);

    this._updatedBooleanData = this._buildNewData();
    this._flatpickerInput = null;

    this.init(mode);
  }

  init(mode) {
    let renderPosition = `beforeend`;
    let currentView = this._taskView;

    if (mode === Mode.ADDING) {
      renderPosition = `afterbegin`;
      currentView = this._taskEdit;
    }

    this._flatpickerInput = flatpickr(this._taskEdit.getElement().querySelector(`.card__date`), {
      altInput: true,
      allowInput: true,
      defaultDate: this._data.dueDate,
      altFormat: `d F, Y`,
      dateFormat: `d F, Y`,
    });

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        if (this._container.contains(this._taskEdit.getElement())) {
          this._onChangeView();
          this._flatpickerInput.close();
        }
      }

      document.removeEventListener(`keydown`, onEscKeyDown);
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
        this._container.replaceChild(this._taskEdit.getElement(), this._taskView.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement()
      .querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement()
      .querySelector(`.card__hashtag-input`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
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
        this._onDataChange(entry, mode === Mode.DEFAULT ? this._data : null);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, () => {

        if (mode === Mode.ADDING) {
          unrenderElement(this._taskEdit.getElement());
          this._taskEdit.removeElement();
          this._onDataChange(null, null);

        } else if (mode === Mode.DEFAULT) {
          this._onDataChange(null, this._data);
        }

      });

    renderElement(this._container, currentView.getElement(), renderPosition);
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
      tags: new Set(formData.getAll(`hashtag`)),
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

    return entry;
  }

  setDefaultView() {
    if (this._container.contains(this._taskEdit.getElement())) {
      this._taskEdit.resetForm();
      this._container.replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    }
  }
}

export default TaskController;
