import mockLists from '@/services/mockData/lists.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ListService {
  constructor() {
    this.lists = [...mockLists];
  }

  async getAll() {
    await delay(300);
    return [...this.lists];
  }

  async getById(id) {
    await delay(200);
    const list = this.lists.find(l => l.Id === parseInt(id));
    if (!list) {
      throw new Error('List not found');
    }
    return list;
  }

  async create(listData) {
    await delay(400);
    
    const newList = {
      Id: Math.max(...this.lists.map(l => l.Id), 0) + 1,
      name: listData.name,
      color: listData.color || '#6366f1',
      icon: listData.icon || 'Folder',
      taskCount: 0,
      createdAt: new Date().toISOString()
    };
    
    this.lists.push(newList);
    return newList;
  }

  async update(id, updateData) {
    await delay(300);
    
    const listIndex = this.lists.findIndex(l => l.Id === parseInt(id));
    if (listIndex === -1) {
      throw new Error('List not found');
    }
    
    const updatedList = {
      ...this.lists[listIndex],
      ...updateData
    };
    
    this.lists[listIndex] = updatedList;
    return updatedList;
  }

  async delete(id) {
    await delay(250);
    
    const listIndex = this.lists.findIndex(l => l.Id === parseInt(id));
    if (listIndex === -1) {
      throw new Error('List not found');
    }
    
    this.lists.splice(listIndex, 1);
    return true;
  }
}

export default new ListService();