const TaskController = require('./controllers/TaskController');

const taskController = new TaskController('tasks');

const routes = {
  'get:/task': taskController.get.bind(taskController),

  'get:/tasks': taskController.index.bind(taskController),

  'post:/task': taskController.create.bind(taskController),

  'put:/task': taskController.update.bind(taskController),

  'delete:/task': taskController.delete.bind(taskController),

  default: (request, response) => {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify({ message: 'Endpoint not found!' }));
    return response.end();
  }
};


module.exports = {
  routes,
  taskController,
};
