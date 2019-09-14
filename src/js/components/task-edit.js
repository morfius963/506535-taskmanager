import AbstractComponent from "./abstract-component.js";
import moment from "moment";

class TaskEdit extends AbstractComponent {
  constructor({id, description, dueDate, repeatingDays, tags, color, isFavorite, isArchive}) {
    super();
    this.id = id;
    this._description = description;
    this._dueDate = dueDate;
    this._repeatingDays = repeatingDays;
    this._tags = tags;
    this._color = color;
    this._isArchive = isArchive;
    this._isFavorite = isFavorite;
    this._changedColor = color;
    this._isDeadLine = moment(Date.now()).subtract(1, `days`).isAfter(dueDate);

    this._formattedDate = this._makeFormattedDate(dueDate);

    this._setCurrentColor();
    this._toggleDateInput();
    this._toggleRepeatingDays();
    this._changeCurrentColor();
    this._addNewHashtag();
    this._deleteHashtags();
  }

  get changedColor() {
    return this._changedColor;
  }

  set changedColor(value) {
    this._changedColor = value;
  }

  getTemplate() {
    return `<article class="card card--edit card--${this._color} ${this._hasRepeatingDays() ? `card--repeat` : ``} ${this._isDeadLine ? `card--deadline` : ``}" id="${this.id}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__control">
            <button 
              type="button" 
              class="card__btn card__btn--archive ${this._isArchive ? `card__btn--disabled` : ``}">
              archive
            </button>
            <button
              type="button"
              class="card__btn card__btn--favorites ${this._isFavorite ? `card__btn--disabled` : ``}"
            >
              favorites
            </button>
          </div>
  
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>
  
          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${this._description}</textarea>
            </label>
          </div>
  
          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${this._getDateView() ? `yes` : `no`}</span>
                </button>
  
                <fieldset class="card__date-deadline ${this._getDateView() ? `` : `visually-hidden`}">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${this._getDateView() ? this._formattedDate : ``}"
                    />
                  </label>
                </fieldset>
  
                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${this._hasRepeatingDays() ? `yes` : `no`}</span>
                </button>
  
                <fieldset class="card__repeat-days ${this._hasRepeatingDays() ? `` : `visually-hidden`}">
                  <div class="card__repeat-days-inner">
                    ${Object.keys(this._repeatingDays).map((day) => `<input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        id="repeat-${day.toLowerCase()}-4"
                        name="repeat"
                        value="${day.toLowerCase()}"
                        ${this._repeatingDays[day] ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-${day.toLowerCase()}-4"
                        >${day.toLowerCase()}</label
                      >`).join(``)}
                  </div>
                </fieldset>
              </div>
  
              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${[...this._tags].map((tag) => `<span class="card__hashtag-inner">
                      <input
                        type="hidden"
                        name="hashtag"
                        value="${tag}"
                        class="card__hashtag-hidden-input"
                      />
                      <p class="card__hashtag-name">
                        #${tag}
                      </p>
                      <button type="button" class="card__hashtag-delete">
                        delete
                      </button>
                    </span>`).join(``)}
                </div>
  
                <label>
                  <input
                    type="text"
                    class="card__hashtag-input"
                    name="hashtag-input"
                    placeholder="Type new hashtag here"
                  />
                </label>
              </div>
            </div>
  
            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                <input
                  type="radio"
                  id="color-black-4"
                  class="card__color-input card__color-input--black visually-hidden"
                  name="color"
                  value="black"
                  checked
                />
                <label
                  for="color-black-4"
                  class="card__color card__color--black"
                  >black</label
                >
                <input
                  type="radio"
                  id="color-yellow-4"
                  class="card__color-input card__color-input--yellow visually-hidden"
                  name="color"
                  value="yellow"
                />
                <label
                  for="color-yellow-4"
                  class="card__color card__color--yellow"
                  >yellow</label
                >
                <input
                  type="radio"
                  id="color-blue-4"
                  class="card__color-input card__color-input--blue visually-hidden"
                  name="color"
                  value="blue"
                />
                <label
                  for="color-blue-4"
                  class="card__color card__color--blue"
                  >blue</label
                >
                <input
                  type="radio"
                  id="color-green-4"
                  class="card__color-input card__color-input--green visually-hidden"
                  name="color"
                  value="green"
                />
                <label
                  for="color-green-4"
                  class="card__color card__color--green"
                  >green</label
                >
                <input
                  type="radio"
                  id="color-pink-4"
                  class="card__color-input card__color-input--pink visually-hidden"
                  name="color"
                  value="pink"
                />
                <label
                  for="color-pink-4"
                  class="card__color card__color--pink"
                  >pink</label
                >
              </div>
            </div>
          </div>
  
          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`;
  }

  resetForm() {
    const currentColor = Array.from(this.getElement()
      .querySelectorAll(`input[name="color"]`))
      .find((input) => input.checked).value;

    this.getElement().querySelector(`.card__form`).reset();
    this.getElement().classList.remove(`card--${currentColor}`);
    this.getElement().classList.add(`card--${this._color}`);

    this._resetValue(this._isArchive, this.getElement().querySelector(`.card__btn--archive`), `card__btn--disabled`);
    this._resetValue(this._isFavorite, this.getElement().querySelector(`.card__btn--favorites`), `card__btn--disabled`);

    this.getElement().querySelector(`.card__date-status`).textContent = this._getDateView() ? `yes` : `no`;
    this.getElement().querySelector(`.card__date`).value = `${this._getDateView() ? this._formattedDate : ``}`;
    this._resetValue(!this._getDateView(), this.getElement().querySelector(`.card__date-deadline`), `visually-hidden`);

    this.getElement().querySelector(`.card__repeat-status`).textContent = this._hasRepeatingDays() ? `yes` : `no`;
    this._resetValue(!this._hasRepeatingDays(), this.getElement().querySelector(`.card__repeat-days`), `visually-hidden`);

    this.getElement().querySelector(`.card__hashtag-list`).innerHTML = ``;
    this.getElement().querySelector(`.card__hashtag-list`).insertAdjacentHTML(`beforeend`, `${[...this._tags].map((tag) => `<span class="card__hashtag-inner">
      <input
        type="hidden"
        name="hashtag"
        value="${tag}"
        class="card__hashtag-hidden-input"
      />
      <p class="card__hashtag-name">
        #${tag}
      </p>
      <button type="button" class="card__hashtag-delete">
        delete
      </button>
    </span>`).join(``)}`);

    this._resetValue(this._hasRepeatingDays(), this.getElement(), `card--repeat`);
    this._setCurrentColor();
  }

  _resetValue(value, elem, cls) {
    if (!value && elem.classList.contains(cls)) {
      elem.classList.remove(cls);
    } else if (value && !elem.classList.contains(cls)) {
      elem.classList.add(cls);
    }
  }

  _hasRepeatingDays() {
    return Object.keys(this._repeatingDays).some((day) => this._repeatingDays[day]);
  }

  _setDefaultDayValue(days, value) {
    days.forEach((day) => {
      day.checked = value;
    });
  }

  _setCurrentColor() {
    const foundColor = Array.from(this.getElement().querySelectorAll(`input[name="color"]`))
      .find((input) => input.value === `${this._color}`);
    if (foundColor) {
      foundColor.checked = true;
    }
  }

  _toggleDateInput() {
    this.getElement()
      .querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        const dateContainer = this.getElement().querySelector(`.card__date-deadline`);
        const dateInput = this.getElement().querySelector(`.card__date`);
        const dateStatus = this.getElement().querySelector(`.card__date-status`);
        const isHidden = dateContainer.classList.contains(`visually-hidden`);

        if (isHidden) {
          dateContainer.classList.remove(`visually-hidden`);
          dateStatus.textContent = `yes`;
          dateInput.value = this._formattedDate;
        } else {
          dateContainer.classList.add(`visually-hidden`);
          dateStatus.textContent = `no`;
          dateInput.value = ``;
        }
      });
  }

  _toggleRepeatingDays() {
    this.getElement()
      .querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        const repeatContainer = this.getElement().querySelector(`.card__repeat-days`);
        const repeatStatus = this.getElement().querySelector(`.card__repeat-status`);
        const repeatValues = this.getElement().querySelectorAll(`.card__repeat-day-input`);
        const isHidden = repeatContainer.classList.contains(`visually-hidden`);

        this.getElement().classList.toggle(`card--repeat`);

        if (isHidden) {
          repeatContainer.classList.remove(`visually-hidden`);
          repeatStatus.textContent = `yes`;
          this._setDefaultDayValue(repeatValues, true);
        } else {
          repeatContainer.classList.add(`visually-hidden`);
          repeatStatus.textContent = `no`;
          this._setDefaultDayValue(repeatValues, false);
        }
      });
  }

  _changeCurrentColor() {
    this.getElement()
      .querySelectorAll(`.card__color-input`)
      .forEach((colorInput) => {
        colorInput.addEventListener(`click`, (evt) => {
          const newColor = evt.currentTarget.value;
          this.getElement().classList.remove(`card--${this.changedColor}`);
          this.changedColor = newColor;
          this.getElement().classList.add(`card--${this.changedColor}`);
        });
      });
  }

  _addNewHashtag() {
    this.getElement()
      .querySelector(`.card__hashtag-input`)
      .addEventListener(`keydown`, (evt) => {
        if (evt.key === `Enter` || evt.code === `Space`) {
          evt.preventDefault();

          this.getElement().querySelector(`.card__hashtag-list`).insertAdjacentHTML(`beforeend`, `<span class="card__hashtag-inner">
            <input
              type="hidden"
              name="hashtag"
              value="${evt.target.value}"
              class="card__hashtag-hidden-input"
            />
            <p class="card__hashtag-name">
              #${evt.target.value}
            </p>
            <button type="button" class="card__hashtag-delete">
              delete
            </button>
          </span>`);

          evt.target.value = ``;
        }
      });
  }

  _deleteHashtags() {
    this.getElement()
      .querySelector(`.card__hashtag-list`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.classList.contains(`card__hashtag-delete`)) {
          evt.target.parentNode.remove();
        }
      });
  }
}

export default TaskEdit;
