import {getFilterData} from "../data.js";
import Filters from "../components/filter.js";

class PageDataController {
  constructor() {
    this._filterNames = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];
    this._filterSibling = document.querySelector(`.main__search`);
  }

  updateFilter(tasks) {
    const filterElem = document.querySelector(`.main__filter`);
    const currentFilter = Array.from(filterElem.querySelectorAll(`.filter__input`)).find((filter) => filter.checked).id;
    const newFilterData = this._filterNames.map((filter) => getFilterData(filter, tasks));
    const newFilterComponent = new Filters(newFilterData);

    filterElem.innerHTML = ``;
    Array.from(newFilterComponent.getElement().children).forEach((input) => {
      filterElem.appendChild(input);
    });
    filterElem.querySelector(`#${currentFilter}`).checked = true;
  }
}

export default PageDataController;
