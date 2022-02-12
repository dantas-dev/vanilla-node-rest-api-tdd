const { describe, it, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');

const app = require('./../src/app');
const { taskController } = require('./../src/routes');

const mockValidTasks = [
  {
    id: '35ed24c6-0ff6-40bd-a280-761879fea74d',
    name: 'Learn ABC',
    state: 'open'
  },
  {
    id: '3e7484d5-7899-42aa-9edb-1d4445f48962',
    name: 'Learn ABC',
    state: 'closed'
  }
];

describe('API Suite Integration Tests', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('/', () => {
    describe('GET', () => {
      it('should return HTTP Status 404 when request an invalid route', async () => {
        const response = await request(app)
          .get('/invalid-route')
          .expect(404);
  
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.be.equal('Endpoint not found!');
      });
    });

    describe('POST', () => {
      it('should return HTTP Status 404 when request an invalid route', async () => {
        const response = await request(app)
          .post('/invalid-route')
          .send({ message: 'invalid-body' })
          .expect(404);
  
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.be.equal('Endpoint not found!');
      });
    });
  
    describe('PUT', () => {
      it('should return HTTP Status 404 when request an invalid route', async () => {
        const response = await request(app)
          .put('/invalid-route')
          .send({ message: 'invalid-body' })
          .expect(404);
  
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.be.equal('Endpoint not found!');
      });
    });
  
    describe('DELETE', () => {
      it('should return HTTP Status 404 when request an invalid route', async () => {
        const response = await request(app)
          .delete('/invalid-route')
          .send({ message: 'invalid-body' })
          .expect(404);
  
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.be.equal('Endpoint not found!');
      });
    });
  });

  describe('/task', () => {
    describe('POST', () => {
      it('should return HTTP Status 200 and created task', async () => {
        const sendBody = { name: mockValidTasks[0].name, state: mockValidTasks[0].state };
        const stubCreate = sandbox.stub(taskController.taskRepository, taskController.taskRepository.create.name)
          .resolves(mockValidTasks[0]);
  
        const response = await request(app)
          .post('/task')
          .send(sendBody)
          .expect(200);
  
          const args = stubCreate.args[0][0];
          const expectedArgs = { name: args.name, state: args.state };
          
        expect(stubCreate.calledOnce).to.be.ok;
        expect(expectedArgs).to.be.deep.equal(sendBody);
        expect(response.body).to.be.an('object');
        expect(response.body).to.be.deep.equal(args);
      });
  
      it('should return HTTP Status 400 when schema is invalid', async () => {
        const spyCreate = sandbox.spy(taskController.taskRepository, taskController.taskRepository.create.name);
  
          const response = await request(app)
          .post('/task')
          .send({ message: 'invalid-body' })
          .expect(400);
  
        expect(spyCreate.notCalled);
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.be.equal('Invalid body!');
      });
    });
  });

  describe('/task/:id', () => {
    describe('GET', () => {
      it('should return HTTP Status 200 and task', async () => {
        const fakeId = '35ed24c6-0ff6-40bd-a280-761879fea74d';
        const stubFindById = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
          .resolves(mockValidTasks[0]);
  
        const response = await request(app)
          .get(`/task/${fakeId}`)
          .expect(200);
  
        expect(stubFindById.calledOnce);
        expect(stubFindById.calledWithExactly(fakeId)).to.be.ok;
        expect(response.body).to.be.an('object');
        expect(response.body).to.be.deep.equal(mockValidTasks[0]);
      });
  
      it('should return HTTP Status 404 and task not found', async () => {
        const fakeId = '35ed24c6-0ff6-40bd-a280-761879fea74d';
        const stubFindById = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
          .resolves(null);
  
        const response = await request(app)
          .get(`/task/${fakeId}`)
          .expect(404);
  
        expect(stubFindById.calledOnce);
        expect(stubFindById.calledWithExactly(fakeId)).to.be.ok;
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.be.equal('Task not found!');
      });
    });

    describe('PUT', () => {
      it('should return HTTP Status 200 and task', async () => {
        const fakeId = '35ed24c6-0ff6-40bd-a280-761879fea74d';
        const sendBody = { name: mockValidTasks[0].name, state: mockValidTasks[0].state };

        const stubFindById = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
          .resolves(mockValidTasks[0]);
        const stubUpdate = sandbox.stub(taskController.taskRepository, taskController.taskRepository.update.name)
        .resolves(mockValidTasks[0]);
  
        const response = await request(app)
          .put(`/task/${fakeId}`)
          .send(sendBody)
          .expect(200);
  
        expect(stubFindById.calledOnce).to.be.ok;
        expect(stubUpdate.calledOnce).to.be.ok;
        expect(stubUpdate.calledWithExactly(mockValidTasks[0])).to.be.ok;
        expect(stubFindById.calledWithExactly(fakeId)).to.be.ok;
        expect(response.body).to.be.an('object');
        expect(response.body).to.be.deep.equal(mockValidTasks[0]);
      });
  
      it('should return HTTP Status 404 and task not found', async () => {
        const fakeId = '35ed24c6-0ff6-40bd-a280-761879fea74d';
        const sendBody = { name: mockValidTasks[0].name, state: mockValidTasks[0].state };

        const stubFindById = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
          .resolves(null);
        const stubUpdate = sandbox.stub(taskController.taskRepository, taskController.taskRepository.update.name)
        .resolves(mockValidTasks[0]);
  
        const response = await request(app)
          .put(`/task/${fakeId}`)
          .send(sendBody)
          .expect(404);
  
        expect(stubFindById.calledOnce).to.be.ok;
        expect(stubUpdate.notCalled).to.be.ok;
        expect(stubFindById.calledWithExactly(fakeId)).to.be.ok;
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.be.equal('Task not found!');
      });

      it('should return HTTP Status 400 when schema is invalid', async () => {
        const fakeId = '35ed24c6-0ff6-40bd-a280-761879fea74d';

        const stubFindById = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
          .resolves(mockValidTasks[0]);
        const spyUpdate = sandbox.spy(taskController.taskRepository, taskController.taskRepository.update.name);
  
        const response = await request(app)
          .put(`/task/${fakeId}`)
          .send({ message: 'invalid-body' })
          .expect(400);
  
        expect(stubFindById.calledOnce).to.be.ok;
        expect(spyUpdate.notCalled).to.be.ok;
        expect(stubFindById.calledWithExactly(fakeId)).to.be.ok;
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.be.equal('Invalid body!');
      });
    });

    describe('DELETE', () => {
      it('should return HTTP Status 200 and delete task', async () => {
        const fakeId = '35ed24c6-0ff6-40bd-a280-761879fea74d';

        const stubFindById = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
          .resolves(mockValidTasks[0]);
        const stubDelete = sandbox.stub(taskController.taskRepository, taskController.taskRepository.delete.name)
          .resolves();
  
        const response = await request(app)
          .delete(`/task/${fakeId}`)
          .expect(200);
  
        expect(stubFindById.calledOnce).to.be.ok;
        expect(stubDelete.calledOnce).to.be.ok;
        expect(stubFindById.calledWithExactly(fakeId)).to.be.ok;
        expect(stubDelete.calledWithExactly(fakeId)).to.be.ok;
        expect(response.body).to.be.empty;
      });

      it('should return HTTP Status 404 and task not found', async () => {
        const fakeId = '35ed24c6-0ff6-40bd-a280-761879fea74d';

        const stubFindById = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findById.name)
          .resolves(null);
        const spyDelete = sandbox.spy(taskController.taskRepository, taskController.taskRepository.delete.name);
  
        const response = await request(app)
          .delete(`/task/${fakeId}`)
          .expect(404);
  
        expect(stubFindById.calledOnce).to.be.ok;
        expect(spyDelete.notCalled).to.be.ok;
        expect(stubFindById.calledWithExactly(fakeId)).to.be.ok;
        expect(response.body).to.be.an('object');
        expect(response.body.message).to.be.equal('Task not found!');
      });
    });
  });

  describe('/tasks', () => {
    describe('GET', () => {
      it('should return HTTP Status 200 and tasks', async () => {
        const stubFindAll = sandbox.stub(taskController.taskRepository, taskController.taskRepository.findAll.name)
          .resolves(mockValidTasks);
  
        const response = await request(app)
          .get('/tasks')
          .expect(200);
  
        expect(stubFindAll.calledOnce);
        expect(response.body).to.be.an('array');
        expect(response.body).to.be.deep.equal(mockValidTasks);
      });
    });
  
  });
});