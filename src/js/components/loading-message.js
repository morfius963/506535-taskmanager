import AbstractComponent from "./abstract-component.js";

class LoadingMessage extends AbstractComponent {
  getTemplate() {
    return `<p class="board__no-tasks">Loading...</p>`;
  }
}

export default LoadingMessage;
