import AbstractComponent from './abstract-component.js';

class TaskEdit extends AbstractComponent {
  constructor({description, dueDate, repeatingDays, tags, color, isFavorite, isArchive}) {
    super();
    this._description = description;
    this._dueDate = new Date(dueDate);
    this._repeatingDays = repeatingDays;
    this._tags = tags;
    this._color = color;
    this._isArchive = isArchive;
    this._isFavorite = isFavorite;

    this._getCurrentColor();
  }

  getTemplate() {
    return `<article class="card card--edit card--${this._color} ${Object.keys(this._repeatingDays).some((day) => this._repeatingDays[day])
      ? `card--repeat` : ``}">
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
                  date: <span class="card__date-status">yes</span>
                </button>
  
                <fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${new Date(this._dueDate).toDateString()} ${String(this._dueDate.getHours()).padStart(2, `0`)}:${String(this._dueDate.getMinutes()).padStart(2, `0`)}"
                    />
                  </label>
                </fieldset>
  
                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${Object.keys(this._repeatingDays).some((day) => this._repeatingDays[day]) ? `YES` : `NO`}</span>
                </button>
  
                <fieldset class="card__repeat-days">
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
                        value="repeat"
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
                  checked
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

  _getCurrentColor() {
    Array.from(this.getElement().querySelectorAll(`input[name="color"]`)).find((input) => input.value === `${this._color}`).checked = true;
  }
}

export default TaskEdit;
