const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');

const TaskController = require('./TaskController');

const mockValidTask = {
  id: '90e93c02-38ec-4de2-bc9a-da211efebcc1',
  name: 'Learning XYZ',
  state: 'open'
};
const mockValidTaskStringify = JSON.stringify(mockValidTask);
const expectedWriteHeadArgs404 = JSON.stringify({ message: 'Task not found!' });
const expectedEndArgs400 = [400, { 'Content-Type': 'application/json' }];
const expectedWriteHeadArgs400 = JSON.stringify({ message: 'Invalid body!' });
const expectedEndArgs404 = [404, { 'Content-Type': 'application/json' }];
const expectedWriteHeadArgs500 = JSON.stringify({ message: 'Internal server error!' });
const expectedEndArgs500 = [500, { 'Content-Type': 'application/json' }];

describe('TaskController Suite Unit Tests', () => {
  let taskController;
  let sandbox;
  let request;
  let response;

  beforeEach(() => {
    taskController = new TaskController('tasks');
    sandbox = sinon.createSandbox();

    request = { itemId: mockValidTask.id };
    response = {
      write: sandbox.fake(),
      writeHead: sandbox.fake(),
      end: sandbox.fake(),
    }
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('get()', () => {
    
    it('should return a task by id', async () => {
      const stubFindById = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
        .resolves(mockValidTask);
  
      await taskController.get(request, response);
      
      expect(stubFindById.calledOnce).to.be.ok;
      expect(sandbox.assert.calledOnce(response.end))
      expect(sandbox.assert.calledOnce(response.write))
      expect(sandbox.assert.calledWithExactly(response.write, mockValidTaskStringify))
    });

    it('should return task not found if cant find task', async () => {
      const spyTaskController = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
        .resolves(null);
  
      await taskController.get(request, response);

      expect(spyTaskController.calledOnce).to.be.ok;
      expect(sandbox.assert.notCalled(response.write))
      expect(response.writeHead.calledWithExactly(...expectedEndArgs404)).to.be.ok;
      expect(response.end.calledWithExactly(expectedWriteHeadArgs404)).to.be.ok;
    });

    it('should return internal server error if an error occurs', async () => {
      const stubTaskController = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
        .throws('An error has occurred');
  
      await taskController.get(request, response);

      expect(stubTaskController.calledOnce).to.be.ok;
      expect(sandbox.assert.notCalled(response.write));
      expect(response.writeHead.calledWithExactly(...expectedEndArgs500)).to.be.ok;
      expect(response.end.calledWithExactly(expectedWriteHeadArgs500)).to.be.ok;
    });
  });

  describe('index()', () => {
    it('should return all the tasks', async () => {
      const stubFindAll = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findAll.name)
        .resolves([mockValidTask]);
  
      await taskController.index(request, response);

      expect(stubFindAll.calledOnce).to.be.ok;
      expect(sandbox.assert.notCalled(response.writeHead));
      expect(sandbox.assert.calledOnce(response.end));
      expect(sandbox.assert.calledOnce(response.write));
      expect(sandbox.assert.calledWithExactly(response.write, JSON.stringify([mockValidTask])));
    });

    it('should return internal server error if an error occurs', async () => {
      const stubFindAll = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findAll.name)
        .throws('An error has occurred');
  
      await taskController.index(request, response);

      expect(stubFindAll.calledOnce).to.be.ok;
      expect(sandbox.assert.notCalled(response.write));
      expect(response.writeHead.calledWithExactly(...expectedEndArgs500)).to.be.ok;
      expect(response.end.calledWithExactly(expectedWriteHeadArgs500)).to.be.ok;
    });
  });

  describe('create()', () => {
    beforeEach(() => {
      request = function* req() {
        yield Promise.resolve(JSON.stringify({ name: mockValidTask.name, state: mockValidTask.state }))
      }
    });

    it('should create a task and returning it', async () => {
      const stubCreate = sandbox.stub(taskController.taskRepository, taskController.taskRepository.create.name)
      .resolves(mockValidTask);
      
      
      await taskController.create(request(), response);

      const args = stubCreate.args[0][0];
      const expectedArgs = { name: args.name, state: args.state };
      
      expect(stubCreate.calledOnce).to.be.ok;
      expect(expectedArgs).to.be.deep.equal({ name: mockValidTask.name, state: mockValidTask.state });
      expect(sandbox.assert.calledOnce(response.end));
      expect(sandbox.assert.calledOnce(response.write));
    });

    it('should return invalid body when schema is invalid', async () => {
      request = function* req() {
        yield Promise.resolve(JSON.stringify({ state: mockValidTask.state }))
      }
      const spyCreate = sandbox.spy(taskController.taskRepository, taskController.taskRepository.create.name);
      
      
      await taskController.create(request(), response);
      
      expect(spyCreate.notCalled).to.be.ok;
      expect(sandbox.assert.notCalled(response.write));
      expect(sandbox.assert.calledOnce(response.end));
      expect(sandbox.assert.calledOnce(response.writeHead));
      expect(response.writeHead.calledWithExactly(...expectedEndArgs400)).to.be.ok;
      expect(response.end.calledWithExactly(expectedWriteHeadArgs400)).to.be.ok;
    });

    it('should show error if occurs', async () => {
      const stubCreate = sandbox.stub(taskController.taskRepository, taskController.taskRepository.create.name)
        .throws('An error has occurred');
        
      await taskController.create(request(), response);

      expect(stubCreate.calledOnce).to.be.ok;
      expect(sandbox.assert.notCalled(response.write));
    });
  });

  describe('update()', () => {
    beforeEach(() => {
      request = function* req() {
        yield Promise.resolve(JSON.stringify({ name: mockValidTask.name, state: mockValidTask.state }))
      }
    });
    
    it('should update a task and returning it', async () => {
      const stubFindById = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
        .resolves(mockValidTask);
      const stubUpdate = sandbox.stub(taskController.taskRepository, taskController.taskRepository.update.name)
        .resolves(mockValidTask);
      

      await taskController.update(request(), response);
      
      expect(stubFindById.calledOnce).to.be.ok;
      expect(stubUpdate.calledOnce).to.be.ok;
      expect(stubUpdate.calledWithExactly(mockValidTask)).to.be.ok;
      expect(sandbox.assert.notCalled(response.writeHead));
      expect(sandbox.assert.calledOnce(response.end));
      expect(sandbox.assert.calledOnce(response.write));
      expect(sandbox.assert.calledWithExactly(response.write, mockValidTaskStringify));
    });

    it('should return task not found if cant find task', async () => {
      const stubFindById = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
        .resolves(null);
  
      await taskController.update(request(), response);
      expect(stubFindById.calledOnce).to.be.ok;
      expect(sandbox.assert.notCalled(response.write));
      expect(sandbox.assert.calledOnce(response.end));
      expect(sandbox.assert.calledOnce(response.writeHead));
      expect(response.writeHead.calledWithExactly(...expectedEndArgs404)).to.be.ok;
      expect(response.end.calledWithExactly(expectedWriteHeadArgs404)).to.be.ok;
    });

    it('should return invalid body when schema is invalid', async () => {
      request = function* req() {
        yield Promise.resolve(JSON.stringify({ state: mockValidTask.state }))
      }
      const stubFindById = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
          .resolves(mockValidTask);
      const spyUpdate = sandbox.spy(taskController.taskRepository, taskController.taskRepository.update.name);
      
      
      await taskController.update(request(), response);
      
      expect(stubFindById.calledOnce).to.be.ok;
      expect(spyUpdate.notCalled).to.be.ok;
      expect(sandbox.assert.notCalled(response.write));
      expect(sandbox.assert.calledOnce(response.end));
      expect(sandbox.assert.calledOnce(response.writeHead));
      expect(response.writeHead.calledWithExactly(...expectedEndArgs400)).to.be.ok;
      expect(response.end.calledWithExactly(expectedWriteHeadArgs400)).to.be.ok;
    });

    it('should show error if occurs', async () => {
      const stubFindById = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
        .resolves(mockValidTask);
      const stubUpdate = sandbox.stub(taskController.taskRepository, taskController.taskRepository.update.name)
        .throws('An error has occurred');
        
      await taskController.update(request(), response);

      expect(stubUpdate.calledOnce).to.be.ok;
      expect(stubFindById.calledOnce).to.be.ok;
      expect(sandbox.assert.notCalled(response.write));
    });
  });

  describe('delete()', () => {
    it('should delete a task by id', async () => {
      const stubFindById = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
        .resolves(mockValidTask);
      const stubDelete = sandbox.stub(taskController.taskRepository, taskController.taskRepository.delete.name)
      .resolves();
  
      await taskController.delete(request, response);

      expect(stubFindById.calledOnce).to.be.ok;
      expect(stubDelete.calledOnce).to.be.ok;
      expect(sandbox.assert.calledOnce(response.end));
      expect(sandbox.assert.notCalled(response.writeHead));
    });

    it('should return task not found if cant find task', async () => {
      const expectedWriteHeadArgs = JSON.stringify({ message: 'Task not found!' });
      const expectedEndArgs = [404, { 'Content-Type': 'application/json' }];

      const stubFindById = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
        .resolves(null);
  
      await taskController.delete(request, response);

      expect(stubFindById.calledOnce).to.be.ok;
      expect(response.writeHead.calledWithExactly(...expectedEndArgs)).to.be.ok;
      expect(response.end.calledWithExactly(expectedWriteHeadArgs)).to.be.ok;
    });

    it('should return a status 500 if an error occurs', async () => {
      const stubFindById = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
        .throws('An error has occurred');
  
      await taskController.delete(request, response);

      expect(stubFindById.calledOnce).to.be.ok;
      expect(response.writeHead.calledWithExactly(...expectedEndArgs500)).to.be.ok;
      expect(response.end.calledWithExactly(expectedWriteHeadArgs500)).to.be.ok;
    });
  });
});