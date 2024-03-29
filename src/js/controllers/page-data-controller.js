import {getFilterData} from "../utils";
import Filters from "../components/filter.js";

class PageDataController {
  constructor() {
    this._newFilterComponent = new Filters();
    this._filterNames = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];
    this._filterSibling = document.querySelector(`.main__search`);
  }

  updateFilter(tasks) {
    const filterElem = document.querySelector(`.main__filter`);
    const currentFilter = Array.from(filterElem.querySelectorAll(`.filter__input`)).find((filter) => filter.checked).id;
    const newFilterData = this._filterNames.map((filter) => getFilterData(filter, tasks));

    this._newFilterComponent.setFilterData(newFilterData);

    filterElem.innerHTML = ``;
    Array.from(this._newFilterComponent.getElement().children).forEach((input) => {
      filterElem.appendChild(input);
    });
    filterElem.querySelector(`#${currentFilter}`).checked = true;
  }
}

export default PageDataController;
