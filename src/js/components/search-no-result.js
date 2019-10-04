import AbstractComponent from "./abstract-component.js";
import moment from "moment";

class SearchNoResult extends AbstractComponent {
  getTemplate() {
    return `<p class="result__empty">
      no matches found...</br></br>
      examples:</br>
      "eat something" - search by description</br>
      "<b>#</b>cinema" - search by hashtag</br>
      "<b>D</b>${moment(Date.now()).format(`DD.MM.YYYY`)}" - search by date</br>
    </p>`;
  }
}

export default SearchNoResult;
