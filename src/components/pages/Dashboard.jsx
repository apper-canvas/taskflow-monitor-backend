import { useState, useEffect, useMemo } from 'react';
import { useOutletContext, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isToday, isFuture, parseISO } from 'date-fns';
import TaskList from '@/components/organisms/TaskList';
import FilterBar from '@/components/molecules/FilterBar';
import taskService from '@/services/api/taskService';
import { toast } from 'react-toastify';

const Dashboard = ({ filter: propFilter }) => {
  const { tasks, setTasks, lists, searchTerm, onEditTask } = useOutletContext();
  const { listId } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    sortBy: 'dueDate'
  });
  
  // Determine current filter based on route
  const currentFilter = propFilter || (listId ? 'list' : 'all');
  
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];
    
    // Apply route-based filtering
    switch (currentFilter) {
      case 'today':
        filtered = filtered.filter(task => {
          if (!task.dueDate || task.completed) return false;
          return isToday(parseISO(task.dueDate));
        });
        break;
      case 'upcoming':
        filtered = filtered.filter(task => {
          if (!task.dueDate || task.completed) return false;
          return isFuture(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate));
        });
        break;
      case 'list':
        filtered = filtered.filter(task => task.listId === listId);
        break;
      default:
        // Show all tasks
        break;
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      if (filters.status === 'active') {
        filtered = filtered.filter(task => !task.completed);
      } else if (filters.status === 'completed') {
        filtered = filtered.filter(task => task.completed);
      } else if (filters.status === 'overdue') {
        filtered = filtered.filter(task => {
          if (task.completed || !task.dueDate) return false;
          return new Date(task.dueDate) < new Date();
        });
      }
    }
    
    // Apply priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'dueDate':
        default:
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
      }
    });
    
    return filtered;
  }, [tasks, currentFilter, listId, searchTerm, filters]);
  
  const handleToggleComplete = async (taskId, completed) => {
    setLoading(true);
    try {
      const updatedTask = await taskService.update(taskId, { completed });
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      
      if (completed) {
        toast.success('Task completed! 🎉');
      } else {
        toast.info('Task marked as incomplete');
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    setLoading(true);
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success('Task deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      sortBy: 'dueDate'
    });
  };
  
  const getPageTitle = () => {
    switch (currentFilter) {
      case 'today':
        return 'Today\'s Tasks';
      case 'upcoming':
        return 'Upcoming Tasks';
      case 'list':
        const list = lists.find(l => l.Id === listId);
        return list ? list.name : 'List Tasks';
      default:
        return 'All Tasks';
    }
  };
  
  const getEmptyMessage = () => {
    if (searchTerm) {
      return `No tasks found for "${searchTerm}"`;
    }
    
    switch (currentFilter) {
      case 'today':
        return 'No tasks due today';
      case 'upcoming':
        return 'No upcoming tasks';
      case 'list':
        return 'No tasks in this list';
      default:
        return 'No tasks yet';
    }
  };
  
  const getEmptyDescription = () => {
    if (searchTerm) {
      return 'Try adjusting your search terms';
    }
    
    switch (currentFilter) {
      case 'today':
        return 'Enjoy your free day! 🎉';
      case 'upcoming':
        return 'You\'re all caught up on future tasks';
      case 'list':
        return 'Start adding tasks to organize your work';
      default:
        return 'Create your first task to get started';
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white">
        <div className="p-6 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {getPageTitle()}
            </h1>
            <p className="text-gray-600">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </motion.div>
        </div>
        
        <div className="px-6 pb-4">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <TaskList
            tasks={filteredTasks}
            loading={loading}
            error={error}
            onToggleComplete={handleToggleComplete}
            onEditTask={onEditTask}
            onDeleteTask={handleDeleteTask}
            emptyMessage={getEmptyMessage()}
            emptyDescription={getEmptyDescription()}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;