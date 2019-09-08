import AbstractComponent from "./abstract-component.js";

class SearchResult extends AbstractComponent {
  getTemplate() {
    return `<section class="result container">
      <button class="result__back">back</button>
    </section>`;
  }
}

export default SearchResult;
