const BaseRepository = require('./../repository/baseRepository');
const Task = require('./../entities/Task');

class TaskController {

  constructor (fileName) {
    this.taskRepository = new BaseRepository({ file: fileName });
  }

  async get(request, response) {
    try {
      const task = await this.taskRepository.findById(request.itemId);
      
      if (!task) {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        return response.end(JSON.stringify({ message: 'Task not found!' }));
      };

      response.write(JSON.stringify(task));
      return response.end();
    } catch (error) {
      console.log(error);
      response.writeHead(500, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ message: 'Internal server error!' }));
    }
  }

  async index(request, response) {
    try {
      const tasks = JSON.stringify(await this.taskRepository.findAll());

      response.write(tasks);
      return response.end();
    } catch (error) {
      console.log(error);
      response.writeHead(500, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ message: 'Internal server error!' }));
    }
  }

  async create(request, response) {
    try {
      for await (const body of request) {
        const { name, state } = JSON.parse(body);

        if (!name || !state) {
          response.writeHead(400, { 'Content-Type': 'application/json' });
          return response.end(JSON.stringify({ message: 'Invalid body!' }));
        }

        const task = new Task({ name, state });
        
        await this.taskRepository.create(task);
        
        response.write(JSON.stringify(task));
        return response.end();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async update(request, response) {
    try {
      for await (const body of request) {
        const task = await this.taskRepository.findById(request.itemId);
        
        if (!task) {
          response.writeHead(404, { 'Content-Type': 'application/json' });
          return response.end(JSON.stringify({ message: 'Task not found!' }));
        };
        
        const { name, state } = JSON.parse(body);

        if (!name || !state) {
          response.writeHead(400, { 'Content-Type': 'application/json' });
          return response.end(JSON.stringify({ message: 'Invalid body!' }));
        }

        const taskUpdated = await this.taskRepository.update({ id: task.id, name, state });
        
        response.write(JSON.stringify(taskUpdated));
        return response.end();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async delete(request, response) {
    try {
      const task = await this.taskRepository.findById(request.itemId);
      
      if (!task) {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        return response.end(JSON.stringify({ message: 'Task not found!' }));
      };

      await this.taskRepository.delete(request.itemId);
      return response.end();
    } catch (error) {
      console.log(error);
      response.writeHead(500, { 'Content-Type': 'application/json' });
      return response.end(JSON.stringify({ message: 'Internal server error!' }));
    }
  }

}

module.exports = TaskController;
