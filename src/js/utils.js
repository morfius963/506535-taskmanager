export const randomArray = (arr) => {
  const oldArray = arr.slice().sort(() => Math.random() - 0.5);
  const newArray = [];

  for (let i = 0; i <= Math.floor(Math.random() * 3); i++) {
    newArray.push(oldArray[i]);
  }

  return newArray;
};

export const getOverdueFilterCount = (tasks) => tasks.reduce((acc, {dueDate}) =>
  (new Date(Date.now()).getDate() > new Date(dueDate).getDate() ? acc + 1 : acc)
  , 0);

export const getTodayFilterCount = (tasks) => tasks.reduce((acc, {dueDate}) =>
  (new Date(dueDate).toDateString() === new Date(Date.now()).toDateString() ? acc + 1 : acc)
  , 0);

export const getBooleanFilterCount = (tasks, value) => tasks.reduce((acc, task) =>
  (task[value] ? acc + 1 : acc)
  , 0);

export const getRepeatingFilterValue = (tasks) => tasks.reduce((acc, {repeatingDays}) =>
  (Object.keys(repeatingDays).some((day) => repeatingDays[day]) ? acc + 1 : acc)
  , 0);

export const getTagsFilterCount = (tasks) => tasks.reduce((acc, {tags}) =>
  (tags.size > 0 ? acc + 1 : acc)
  , 0);
