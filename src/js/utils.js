import moment from "moment";

export const sortByValue = (list, value) => {
  let sortedResult = list.slice();

  switch (value) {
    case `up`:
      sortedResult.sort((a, b) => a.dueDate > b.dueDate ? 1 : -1);
      break;
    case `down`:
      sortedResult.sort((a, b) => b.dueDate > a.dueDate ? 1 : -1);
      break;
    case `default`:
      sortedResult = list.slice();
      break;
  }

  return sortedResult;
};

export const getRandomNum = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

export const getRandomArray = (arr, min, max) => {
  const sortedArray = arr.slice().sort(() => Math.random() - 0.5);
  const randomMax = getRandomNum(min, max);

  return sortedArray.slice(min, randomMax);
};

export const POSITION = {
  afterbegin: `afterbegin`,
  beforeend: `beforeend`,
  afterend: `afterend`
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
    case POSITION.afterend:
      container.after(element);
      break;
  }
};

export const unrenderElement = (element) => {
  if (element) {
    element.remove();
  }
};

const getOverdueFilterCount = (tasks) => tasks.reduce((acc, {dueDate}) =>
  (moment(Date.now()).subtract(1, `days`).isAfter(dueDate) ? acc + 1 : acc), 0);

const getTodayFilterCount = (tasks) => tasks.reduce((acc, {dueDate}) =>
  (new Date(dueDate).toDateString() === new Date(Date.now()).toDateString() ? acc + 1 : acc), 0);

const getBooleanFilterCount = (tasks, value) => tasks.reduce((acc, task) =>
  (task[value] ? acc + 1 : acc), 0);

const getRepeatingFilterValue = (tasks) => tasks.reduce((acc, {repeatingDays}) =>
  (Object.keys(repeatingDays).some((day) => repeatingDays[day]) ? acc + 1 : acc), 0);

const getTagsFilterCount = (tasks) => tasks.reduce((acc, {tags}) =>
  (tags.size > 0 ? acc + 1 : acc), 0);

const FilterValues = {
  'all': (taskList) => taskList.filter(({isArchive}) => !isArchive).length,
  'overdue': (taskList) => getOverdueFilterCount(taskList),
  'today': (taskList) => getTodayFilterCount(taskList),
  'favorites': (taskList) => getBooleanFilterCount(taskList, `isFavorite`),
  'repeating': (taskList) => getRepeatingFilterValue(taskList),
  'tags': (taskList) => getTagsFilterCount(taskList),
  'archive': (taskList) => getBooleanFilterCount(taskList, `isArchive`)
};

const getFilterCount = (name, taskList) => FilterValues[name](taskList);

export const getFilterData = (filterName, tasks) => ({
  title: filterName,
  count: getFilterCount(filterName, tasks)
});

export const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};
