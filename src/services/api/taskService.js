import mockTasks from '@/services/mockData/tasks.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...mockTasks];
  }

  async getAll() {
    await delay(300);
    // Add list name to tasks for display
    return this.tasks.map(task => ({
      ...task,
      listName: task.listId ? `List ${task.listId}` : null
    }));
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  async create(taskData) {
    await delay(400);
    
    const newTask = {
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      title: taskData.title,
      description: taskData.description || '',
      listId: taskData.listId || null,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    this.tasks.push(newTask);
    return newTask;
  }

  async update(id, updateData) {
    await delay(300);
    
    const taskIndex = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...this.tasks[taskIndex],
      ...updateData,
      completedAt: updateData.completed && !this.tasks[taskIndex].completed 
        ? new Date().toISOString() 
        : updateData.completed === false 
          ? null 
          : this.tasks[taskIndex].completedAt
    };
    
    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  async delete(id) {
    await delay(250);
    
    const taskIndex = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks.splice(taskIndex, 1);
    return true;
  }

  async getByListId(listId) {
    await delay(300);
    return this.tasks.filter(task => task.listId === listId);
  }

  async getCompleted() {
    await delay(300);
    return this.tasks.filter(task => task.completed);
  }
}

export default new TaskService();