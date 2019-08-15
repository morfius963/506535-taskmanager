import {randomArray} from './utils.js';
import {getOverdueFilterCount} from './utils.js';
import {getTodayFilterCount} from './utils.js';
import {getBooleanFilterCount} from './utils.js';
import {getRepeatingFilterValue} from './utils.js';
import {getTagsFilterCount} from './utils.js';

const TASK_COUNT = 20;

const filterNames = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];

const getTaskData = () => ({
  description: [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`
  ][Math.floor(Math.random() * 3)],
  dueDate: Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
  repeatingDays: {
    'Mo': Boolean(Math.round(Math.random())),
    'Tu': false,
    'We': false,
    'Th': Boolean(Math.round(Math.random())),
    'Fr': false,
    'Sa': false,
    'Su': false
  },
  tags: new Set(randomArray([
    `homework`,
    `theory`,
    `practice`,
    `intensive`,
    `keks`,
    `relax`,
    `work`
  ])),
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

const getFilterData = (filterName) => ({
  title: filterName,
  count: getFilterCount(filterName, tasks)
});

const getFilterCount = (name, taskList) => {
  const FilterValues = {
    'all': taskList.length,
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
export const tasks = new Array(TASK_COUNT).fill(``).map(getTaskData);

// сткуртура даних усіх фільтрів
export const filters = filterNames.map(getFilterData);