import {createElement} from '../utils.js';

class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    throw Error(`Abstract method not implemented`);
  }

  _getDateView() {
    return new Date(this._dueDate).toString() !== `Invalid Date`;
  }

  _makeFormattedDate(dateValue) {
    const dateTs = dateValue ? dateValue : Date.now();
    const date = new Date(dateTs);
    return `${date.toDateString()} ${String(date.getHours()).padStart(2, `0`)}:${String(date.getMinutes()).padStart(2, `0`)}`;
  }
}

export default AbstractComponent;
