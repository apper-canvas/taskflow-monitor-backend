import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/organisms/Header';
import Sidebar from '@/components/organisms/Sidebar';
import TaskModal from '@/components/organisms/TaskModal';
import ListModal from '@/components/organisms/ListModal';
import taskService from '@/services/api/taskService';
import listService from '@/services/api/listService';
import { toast } from 'react-toastify';

const Layout = () => {
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingList, setEditingList] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    calculateTaskCounts();
  }, [tasks]);
  
  const loadData = async () => {
    try {
      const [tasksData, listsData] = await Promise.all([
        taskService.getAll(),
        listService.getAll()
      ]);
      setTasks(tasksData);
      setLists(listsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    }
  };
  
  const calculateTaskCounts = () => {
    const counts = {
      all: tasks.filter(task => !task.completed).length,
      today: tasks.filter(task => {
        if (task.completed || !task.dueDate) return false;
        const today = new Date();
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === today.toDateString();
      }).length,
      upcoming: tasks.filter(task => {
        if (task.completed || !task.dueDate) return false;
        const today = new Date();
        const taskDate = new Date(task.dueDate);
        return taskDate > today;
      }).length
    };
    
    // Count tasks per list
    lists.forEach(list => {
      counts[list.Id] = tasks.filter(task => 
        task.listId === list.Id && !task.completed
      ).length;
    });
    
    setTaskCounts(counts);
  };
  
  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };
  
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };
  
  const handleSaveTask = async (taskData) => {
    setLoading(true);
    try {
      let savedTask;
      if (editingTask) {
        savedTask = await taskService.update(editingTask.Id, taskData);
        setTasks(prev => prev.map(task => 
          task.Id === editingTask.Id ? savedTask : task
        ));
        toast.success('Task updated successfully');
      } else {
        savedTask = await taskService.create(taskData);
        setTasks(prev => [...prev, savedTask]);
        toast.success('Task created successfully');
      }
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddList = () => {
    setEditingList(null);
    setShowListModal(true);
  };
  
  const handleSaveList = async (listData) => {
    setLoading(true);
    try {
      let savedList;
      if (editingList) {
        savedList = await listService.update(editingList.Id, listData);
        setLists(prev => prev.map(list => 
          list.Id === editingList.Id ? savedList : list
        ));
        toast.success('List updated successfully');
      } else {
        savedList = await listService.create(listData);
        setLists(prev => [...prev, savedList]);
        toast.success('List created successfully');
      }
      setShowListModal(false);
      setEditingList(null);
    } catch (error) {
      console.error('Error saving list:', error);
      toast.error('Failed to save list');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        lists={lists}
        taskCounts={taskCounts}
        onAddList={handleAddList}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onSearch={setSearchTerm}
          onAddTask={handleAddTask}
        />
        
        <main className="flex-1 overflow-y-auto">
          <motion.div
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet context={{
              tasks,
              setTasks,
              lists,
              searchTerm,
              onEditTask: handleEditTask,
              loadData
            }} />
          </motion.div>
        </main>
      </div>
      
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        lists={lists}
        loading={loading}
      />
      
      <ListModal
        isOpen={showListModal}
        onClose={() => {
          setShowListModal(false);
          setEditingList(null);
        }}
        onSave={handleSaveList}
        list={editingList}
        loading={loading}
      />
    </div>
  );
};

export default Layout;