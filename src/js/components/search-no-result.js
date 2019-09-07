import AbstractComponent from "./abstract-component.js";

class SearchNoResult extends AbstractComponent {
  getTemplate() {
    return `<p class="result__empty">no matches found...</p>`;
  }
}

export default SearchNoResult;
