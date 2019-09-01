import {createElement} from '../utils.js';
import moment from 'moment';

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
    return !!this._dueDate;
  }

  _makeFormattedDate(dateValue) {
    const dateTs = dateValue ? dateValue : Date.now();
    return moment(dateTs).format(`DD MMMM, YYYY`);
  }
}

export default AbstractComponent;
