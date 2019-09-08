import {getFilterData} from "../data.js";
import {unrenderElement, renderElement} from "../utils.js";
import Filters from "../components/filter.js";

class PageDataController {
  constructor() {
    this._filterNames = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];
    this._filterSibling = document.querySelector(`.main__search`);
  }

  updateFilter(tasks) {
    const filterElem = document.querySelector(`.main__filter`);
    const newFilterData = this._filterNames.map((filter) => getFilterData(filter, tasks));
    const newFilterComponent = new Filters(newFilterData);

    unrenderElement(filterElem);
    renderElement(this._filterSibling, newFilterComponent.getElement(), `afterend`);
  }
}

export default PageDataController;
