import {randomArray} from './utils.js';

const TASK_COUNT = 20;

const filterNames = [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`];

export const getTaskData = () => ({
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

export const getFilterData = (filterName) => ({
  title: filterName,
  count: getFilterCount(filterName, tasks)
});

const getFilterCount = (name, taskList) => {
  const FilterValues = {
    'all': tasks.length,
    'overdue': taskList.reduce((acc, {dueDate}) =>
      (new Date(Date.now()).getDate() > new Date(dueDate).getDate() ? acc + 1 : acc), 0),

    'today': taskList.reduce((acc, {dueDate}) =>
      (new Date(dueDate).toDateString() === new Date(Date.now()).toDateString() ? acc + 1 : acc), 0),

    'favorites': taskList.reduce((acc, {isFavorite}) =>
      (isFavorite ? acc + 1 : acc), 0),

    'repeating': taskList.reduce((acc, {repeatingDays}) =>
      (Object.keys(repeatingDays).some((day) => repeatingDays[day]) ? acc + 1 : acc), 0),

    'tags': taskList.reduce((acc, {tags}) =>
      (tags.size > 0 ? acc + 1 : acc), 0),

    'archive': taskList.reduce((acc, {isArchive}) =>
      (isArchive ? acc + 1 : acc), 0)
  };

  return FilterValues[name];
};

// структура даних всіх тасків
export const tasks = new Array(TASK_COUNT).fill(``).map(getTaskData);

// сткуртура даних усіх фільтрів
export const filters = filterNames.map(getFilterData);
