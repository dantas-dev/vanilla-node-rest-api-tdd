const Base = require('./Base');
const { generateID } = require('./../utils');

class Task extends Base {
  constructor({ name, state }) {
    const id = generateID();

    super({ id, name });
    this.id = id;
    this.state = state;
  }
}

module.exports = Task;
