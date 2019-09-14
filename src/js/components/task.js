import AbstractComponent from "./abstract-component.js";
import moment from "moment";

class Task extends AbstractComponent {
  constructor({id, description, dueDate, repeatingDays, tags, color, isArchive, isFavorite}) {
    super();
    this.id = id;
    this._description = description;
    this._dueDate = dueDate;
    this._repeatingDays = repeatingDays;
    this._tags = tags;
    this._color = color;
    this._isArchive = isArchive;
    this._isFavorite = isFavorite;
    this._isDeadLine = moment(Date.now()).subtract(1, `days`).isAfter(dueDate);

    this._formattedDate = this._makeFormattedDate(dueDate);
  }

  getTemplate() {
    return `<article class="card card--${this._color} ${Object.keys(this._repeatingDays).some((day) => this._repeatingDays[day])
      ? `card--repeat` : ``} ${this._isDeadLine ? `card--deadline` : ``}" id="${this.id}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
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
            <p class="card__text">${this._description}</p>
          </div>
  
          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${this._getDateView() ? this._formattedDate : ``}</span>
                  </p>
                </div>
              </div>
  
              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${[...this._tags].map((tag) => `<span class="card__hashtag-inner">
                    <span class="card__hashtag-name">
                      #${tag}
                    </span>
                  </span>`).join(``)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`;
  }
}

export default Task;
