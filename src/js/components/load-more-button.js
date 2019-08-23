import AbstractComponent from "./abstract-component.js";

class LoadMore extends AbstractComponent {
  getTemplate() {
    return `<button class="load-more" type="button">load more</button>`;
  }
}

export default LoadMore;
