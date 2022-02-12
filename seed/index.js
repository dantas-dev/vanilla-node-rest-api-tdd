require('dotenv').config();
const faker = require('faker');

const BaseRepository = require('./../src/repository/baseRepository');
const Task = require('./../src/entities/Task');
const { getRandomIndexFromArray } = require('./../src/utils');

const AMOUNT = process.env.SEED_AMOUNT || 10;
const TASK_STATE = ['open', 'closed'];

let tasks = [];
const seedDatabase = async () => {
  for (let index = 0; index <= AMOUNT; index++) {
    const task = new Task({
      id: faker.datatype.uuid(),
      name: faker.random.words(),
      state: TASK_STATE[getRandomIndexFromArray(TASK_STATE)],
    });
  
    tasks.push(task);
  }
  
  const taskRepository = new BaseRepository({ file: 'tasks' });
  await taskRepository.bulkCreate(tasks);
}

(async () => {
  await seedDatabase();
})();