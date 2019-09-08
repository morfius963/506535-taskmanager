import AbstractComponent from "./abstract-component.js";

class SearchResultInfo extends AbstractComponent {
  constructor({title, count}) {
    super();

    this._title = title;
    this._count = count;
  }

  getTemplate() {
    return `<h2 class="result__title">
      ${this._title}<span class="result__count">${this._count}</span>
    </h2>`;
  }

  updateCount(count) {
    this.getElement().querySelector(`.result__count`).textContent = count;
  }
}

export default SearchResultInfo;
