import AbstractComponent from "./abstract-component.js";

class SearchResultGroup extends AbstractComponent {
  getTemplate() {
    return `<section class="result__group">
      <div class="result__cards"></div>
    </section>`;
  }
}

export default SearchResultGroup;
