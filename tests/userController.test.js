const httpMocks = require('node-mocks-http');
const {
  createNewTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require('../src/controllers/taskController');

const Task = require('../src/models/task');

jest.mock('../src/models/task');

describe('Task Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewTask', () => {
    it('should create and return a new task', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/createNewTask/123',
        params: { userId: '123' },
        body: {
          title: 'Test Task',
          description: 'Test description',
        },
      });
      const res = httpMocks.createResponse();

      Task.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(true),
      }));

      await createNewTask(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("User profile retrive successfully");
    });
  });

  describe('getAllTasks', () => {
    it('should return tasks for regular user', async () => {
      const fakeTasks = [{ title: 'Task1' }, { title: 'Task2' }];
      Task.find.mockResolvedValue(fakeTasks);

      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/getAllTasks/123',
        user: { role: 'user', _id: '123' },
        params: { userId: '123' },
      });
      const res = httpMocks.createResponse();

      await getAllTasks(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(fakeTasks);
    });
  });

  describe('updateTask', () => {
    it('should update a task if found', async () => {
      const fakeTask = {
        _id: 'task123',
        title: 'Old Title',
        save: jest.fn(),
      };

      Task.findOne.mockResolvedValue(fakeTask);

      const req = httpMocks.createRequest({
        method: 'PUT',
        url: '/updateTask/123',
        user: { role: 'user', _id: '123' },
        body: {
          _id: 'task123',
          title: 'New Title',
        },
      });
      const res = httpMocks.createResponse();

      await updateTask(req, res);
      const data = res._getJSONData();

      expect(Task.findOne).toHaveBeenCalledWith({
        _id: 'task123',
        createdBy: '123',
      });
      expect(fakeTask.save).toHaveBeenCalled();
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('New Title');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task if authorized', async () => {
      const req = httpMocks.createRequest({
        method: 'DELETE',
        url: '/deleteTask/123/task456',
        user: { role: 'user', _id: '123' },
        params: { userId: '123', _id: 'task456' },
      });
      const res = httpMocks.createResponse();

      Task.findOneAndDelete.mockResolvedValue(true);

      await deleteTask(req, res);
      const data = res._getJSONData();

      expect(Task.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'task456',
        createdBy: '123',
      });
      expect(res.statusCode).toBe(200);
      expect(data.message).toBe('user deleted successfully');
    });
  });
});
