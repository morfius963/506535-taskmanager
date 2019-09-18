import AbstractComponent from "./abstract-component.js";
import {createElement} from '../utils.js';

class Filters extends AbstractComponent {
  constructor() {
    super();
    this._filters = [];
  }

  static getMockElement() {
    return createElement(`<section class="main__filter filter container">
      <input
        type="radio"
        id="filter__all"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__all" class="filter__label">
        All </label
      >
      <input
        type="radio"
        id="filter__overdue"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__overdue" class="filter__label"
        >Overdue </label
      >
      <input
        type="radio"
        id="filter__today"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__today" class="filter__label"
        >Today </label
      >
      <input
        type="radio"
        id="filter__favorites"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__favorites" class="filter__label"
        >Favorites </label
      >
      <input
        type="radio"
        id="filter__repeating"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__repeating" class="filter__label"
        >Repeating </label
      >
      <input
        type="radio"
        id="filter__tags"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__tags" class="filter__label"
        >Tags </label
      >
      <input
        type="radio"
        id="filter__archive"
        class="filter__input visually-hidden"
        name="filter"
      />
      <label for="filter__archive" class="filter__label"
        >Archive </label
      >
    </section>`);
  }

  setFilterData(filters) {
    this.removeElement();
    this._filters = filters;
  }

  getTemplate() {
    return `<section class="main__filter filter container">
      ${this._filters.map(({title, count}) => `<input
        type="radio"
        id="filter__${title}"
        class="filter__input visually-hidden"
        name="filter"
        ${title === `all` ? `checked` : ``}
        ${count > 0 ? `` : `disabled`}
      />
      <label for="filter__${title}" class="filter__label">
      ${title.toUpperCase()} <span class="filter__${title}-count">${count}</span></label>`)
      .join(``)}
    </section>`;
  }
}

export default Filters;
