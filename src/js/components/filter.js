import {createElement} from '../utils.js';
import {removeElem} from '../utils.js';

class Filters {
  constructor(filters) {
    this._filters = filters;
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
