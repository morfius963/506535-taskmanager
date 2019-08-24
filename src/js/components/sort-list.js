import AbstractComponent from "./abstract-component.js";

class SortList extends AbstractComponent {
  getTemplate() {
    return `<div class="board__filter-list">
      <a href="#" class="board__filter">SORT BY DEFAULT</a>
      <a href="#" class="board__filter">SORT BY DATE up</a>
      <a href="#" class="board__filter">SORT BY DATE down</a>
    </div>`;
  }
}

export default SortList;
