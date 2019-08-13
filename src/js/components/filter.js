export const makeFilterTemplate = ({title, count}) => (
  `<input
    type="radio"
    id="filter__${title}"
    class="filter__input visually-hidden"
    name="filter"
    checked
  />
  <label for="filter__${title}" class="filter__label">
  ${title.toUpperCase()} <span class="filter__${title}-count">${count}</span></label>`.trim()
);
