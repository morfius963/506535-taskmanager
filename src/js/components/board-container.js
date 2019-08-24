import AbstractComponent from "./abstract-component.js";

class BoardContainer extends AbstractComponent {
  getTemplate() {
    return `<section class="board container"></section>`;
  }
}

export default BoardContainer;
