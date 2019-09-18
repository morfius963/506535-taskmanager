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
const ON_DATA_CHANGE_DELAY = 1000;

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
      allowInput: false,
      defaultDate: this._data.dueDate,
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
        this._onDataChange(`update`, this._updatedBooleanData);
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
        this._onDataChange(`update`, this._updatedBooleanData);
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

        this.blockForm(`save`, true);
        setTimeout(this._onDataChange.bind(this,
            mode === Mode.DEFAULT ? `update` : `create`,
            entry,
            () => {
              this.onErrorDataChange();
            }),
        ON_DATA_CHANGE_DELAY);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, () => {

        this.blockForm(`delete`, true);

        if (mode === Mode.ADDING) {
          unrenderElement(this._taskEdit.getElement());
          this._taskEdit.removeElement();
          this._onDataChange(null, null);

        } else if (mode === Mode.DEFAULT) {
          setTimeout(this._onDataChange.bind(this, `delete`, this._data), ON_DATA_CHANGE_DELAY);
        }

      });

    renderElement(this._container, currentView.getElement(), renderPosition);
  }

  blockForm(btnValue, isDisabled) {
    const buttonSave = this._taskEdit.getElement().querySelector(`.card__save`);
    const buttonDelete = this._taskEdit.getElement().querySelector(`.card__delete`);

    this._taskEdit.getElement().querySelector(`.card__text`).disabled = isDisabled;
    this._taskEdit.getElement().querySelector(`.card__hashtag-input`).disabled = isDisabled;
    this._taskEdit.getElement().querySelector(`.card__inner`).style.boxShadow = ``;
    this._taskEdit.getElement().querySelector(`.card__inner`).style.borderColor = `#000000`;
    buttonSave.disabled = isDisabled;
    buttonDelete.disabled = isDisabled;

    if (isDisabled) {
      if (btnValue === `save`) {
        buttonSave.textContent = `Saving...`;
      } else {
        buttonDelete.textContent = `Deleting...`;
      }
    } else {
      buttonSave.textContent = `Save`;
      buttonDelete.textContent = `Delete`;
    }
  }

  shakeTask() {
    const ANIMATION_TIMEOUT = 600;
    const taskEditElement = this._taskEdit.getElement();
    taskEditElement.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    taskEditElement.style.zIndex = `1`;

    setTimeout(() => {
      taskEditElement.style.animation = ``;
      taskEditElement.style.zIndex = ``;
    }, ANIMATION_TIMEOUT);
  }

  onErrorDataChange() {
    this.shakeTask();
    this.blockForm(null, false);
    this._taskEdit.getElement().querySelector(`.card__inner`).style.boxShadow = `0 0 10px 0 red`;
    this._taskEdit.getElement().querySelector(`.card__inner`).style.borderColor = `red`;
  }

  setDefaultView() {
    if (this._container.contains(this._taskEdit.getElement())) {
      this._taskEdit.resetForm();
      this._container.replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    }
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
    const taskId = this._taskView.getElement().id;
    const formData = new FormData(this._taskEdit.getElement().querySelector(`.card__form`));
    const isFavorite = this._taskEdit.getElement().querySelector(`.card__btn--favorites`).classList.contains(`card__btn--disabled`) ? true : false;
    const isArchive = this._taskEdit.getElement().querySelector(`.card__btn--archive`).classList.contains(`card__btn--disabled`) ? true : false;

    const entry = {
      id: taskId,
      description: formData.get(`text`),
      color: formData.get(`color`),
      tags: new Set(formData.getAll(`hashtag`)),
      dueDate: formData.get(`date`) === `` ? null : new Date(formData.get(`date`)),
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
      isArchive,
      toRAW() {
        return {
          'id': this.id,
          'description': this.description,
          'due_date': this.dueDate,
          'tags': [...this.tags.values()],
          'repeating_days': this.repeatingDays,
          'color': this.color,
          'is_favorite': this.isFavorite,
          'is_archived': this.isArchive,
        };
      }
    };

    return entry;
  }
}

export default TaskController;
