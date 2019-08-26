export const getRandomNum = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

export const getRandomArray = (arr, min, max) => {
  const sortedArray = arr.slice().sort(() => Math.random() - 0.5);
  const randomMax = getRandomNum(min, max);

  return sortedArray.slice(min, randomMax);
};

export const getOverdueFilterCount = (tasks) => tasks.reduce((acc, {dueDate}) =>
  (Date.now() > dueDate ? acc + 1 : acc), 0);

export const getTodayFilterCount = (tasks) => tasks.reduce((acc, {dueDate}) =>
  (new Date(dueDate).toDateString() === new Date(Date.now()).toDateString() ? acc + 1 : acc), 0);

export const getBooleanFilterCount = (tasks, value) => tasks.reduce((acc, task) =>
  (task[value] ? acc + 1 : acc), 0);

export const getRepeatingFilterValue = (tasks) => tasks.reduce((acc, {repeatingDays}) =>
  (Object.keys(repeatingDays).some((day) => repeatingDays[day]) ? acc + 1 : acc), 0);

export const getTagsFilterCount = (tasks) => tasks.reduce((acc, {tags}) =>
  (tags.size > 0 ? acc + 1 : acc), 0);

export const POSITION = {
  afterbegin: `afterbegin`,
  beforeend: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const renderElement = (container, element, place) => {
  switch (place) {
    case POSITION.afterbegin:
      container.prepend(element);
      break;
    case POSITION.beforeend:
      container.append(element);
      break;
  }
};

export const removeElem = (element) => {
  if (element) {
    element.remove();
  }
};
