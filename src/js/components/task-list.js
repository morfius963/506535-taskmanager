import AbstractComponent from "./abstract-component.js";

class TaskList extends AbstractComponent {
  getTemplate() {
    return `<div class="board__tasks"></div>`;
  }
}

export default TaskList;
