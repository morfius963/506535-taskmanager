import {getRandomArray} from "./utils.js";
import {getOverdueFilterCount} from "./utils.js";
import {getTodayFilterCount} from "./utils.js";
import {getBooleanFilterCount} from "./utils.js";
import {getRepeatingFilterValue} from "./utils.js";
import {getTagsFilterCount} from "./utils.js";

const MOCK_DATA_COUNT = {
  TAG: {
    MIN: 0,
    MAX: 3
  },
  TASK: {
    COUNT: 12
  }
};

const filterNames = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];

const getTaskData = () => ({
  description: [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`
  ][Math.floor(Math.random() * 3)],
  dueDate: new Date(Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
  repeatingDays: {
    'mo': Boolean(Math.round(Math.random())),
    'tu': false,
    'we': false,
    'th': Boolean(Math.round(Math.random())),
    'fr': false,
    'sa': false,
    'su': false
  },
  tags: new Set(getRandomArray([
    `homework`,
    `theory`,
    `practice`,
    `intensive`,
    `keks`,
    `relax`,
    `work`
  ], MOCK_DATA_COUNT.TAG.MIN, MOCK_DATA_COUNT.TAG.MAX)),
  color: [
    `black`,
    `yellow`,
    `blue`,
    `green`,
    `pink`,
  ][Math.floor(Math.random() * 5)],
  isFavorite: Boolean(Math.round(Math.random())),
  isArchive: Boolean(Math.round(Math.random()))
});

export const getFilterData = (filterName, tasks) => ({
  title: filterName,
  count: getFilterCount(filterName, tasks)
});

const getFilterCount = (name, taskList) => {
  const FilterValues = {
    'all': taskList.filter(({isArchive}) => !isArchive).length,
    'overdue': getOverdueFilterCount(taskList),
    'today': getTodayFilterCount(taskList),
    'favorites': getBooleanFilterCount(taskList, `isFavorite`),
    'repeating': getRepeatingFilterValue(taskList),
    'tags': getTagsFilterCount(taskList),
    'archive': getBooleanFilterCount(taskList, `isArchive`)
  };

  return FilterValues[name];
};

// структура даних всіх тасків
export const tasks = new Array(MOCK_DATA_COUNT.TASK.COUNT).fill(``).map(getTaskData);

// сткуртура даних усіх фільтрів
export const filters = filterNames.map((filter) => getFilterData(filter, tasks));
