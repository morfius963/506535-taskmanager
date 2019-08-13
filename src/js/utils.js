export const randomArray = (arr) => {
  const oldArray = arr.slice();
  const newArray = [];

  oldArray.sort(() => Math.random() - 0.5);

  for (let i = 0; i <= Math.floor(Math.random() * 3); i++) {
    newArray.push(oldArray[i]);
  }

  return newArray;
};
