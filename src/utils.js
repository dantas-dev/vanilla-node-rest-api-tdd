const generateID = () => {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};

const getRandomIndexFromArray = (arrayList) => {
  const arrayListLength = arrayList.length;

  return Math.floor(Math.random() * (arrayListLength));    
}

module.exports = {
  generateID,
  getRandomIndexFromArray,
};
