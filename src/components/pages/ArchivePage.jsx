import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import TaskList from '@/components/organisms/TaskList';
import FilterBar from '@/components/molecules/FilterBar';
import Button from '@/components/atoms/Button';
import taskService from '@/services/api/taskService';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';

const ArchivePage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState({
    status: 'completed',
    priority: 'all',
    sortBy: 'completedAt'
  });
  
  useEffect(() => {
    loadArchivedTasks();
  }, []);
  
  const loadArchivedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const allTasks = await taskService.getAll();
      const completedTasks = allTasks.filter(task => task.completed);
      setTasks(completedTasks);
    } catch (err) {
      setError('Failed to load archived tasks');
      console.error('Error loading archived tasks:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    
    // Apply sorting
filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'completedAt':
        default:
          return new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt);
      }
    });
    
    return filtered;
  }, [tasks, searchTerm, filters]);
  
  const handleRestoreTask = async (taskId) => {
    try {
      const updatedTask = await taskService.update(taskId, { 
        completed: false,
        completedAt: null 
      });
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success('Task restored successfully');
    } catch (error) {
      console.error('Error restoring task:', error);
      toast.error('Failed to restore task');
    }
  };
  
  const handleDeletePermanently = async (taskId) => {
    if (!window.confirm('Are you sure you want to permanently delete this task? This action cannot be undone.')) {
      return;
    }
    
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success('Task permanently deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };
  
  const handleBulkRestore = async () => {
    if (!window.confirm(`Are you sure you want to restore all ${filteredTasks.length} tasks?`)) {
      return;
    }
    
    try {
      await Promise.all(
        filteredTasks.map(task => 
          taskService.update(task.Id, { completed: false, completedAt: null })
        )
      );
      setTasks([]);
      toast.success(`${filteredTasks.length} tasks restored successfully`);
    } catch (error) {
      console.error('Error restoring tasks:', error);
      toast.error('Failed to restore tasks');
    }
  };
  
  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete all ${filteredTasks.length} tasks? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await Promise.all(
        filteredTasks.map(task => taskService.delete(task.Id))
      );
      setTasks(prev => prev.filter(task => !filteredTasks.find(ft => ft.Id === task.Id)));
      toast.success(`${filteredTasks.length} tasks permanently deleted`);
    } catch (error) {
      console.error('Error deleting tasks:', error);
      toast.error('Failed to delete tasks');
    }
  };
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleClearFilters = () => {
    setFilters({
      status: 'completed',
      priority: 'all',
      sortBy: 'completedAt'
    });
    setSearchTerm('');
  };
  
  // Custom task card for archive with restore/delete actions
  const ArchiveTaskCard = ({ task }) => (
    <motion.div
      className="card p-4 border border-gray-100 bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-700 line-through mb-1">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-500 line-through mb-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {task.completedAt && (
              <div className="flex items-center gap-1">
                <ApperIcon name="Check" size={12} />
                <span>Completed {new Date(task.completedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleRestoreTask(task.Id)}
            className="flex items-center gap-1"
          >
            <ApperIcon name="RotateCcw" size={14} />
            Restore
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDeletePermanently(task.Id)}
            className="flex items-center gap-1"
          >
            <ApperIcon name="Trash2" size={14} />
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 bg-white">
        <div className="p-6 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Archive
                </h1>
                <p className="text-gray-600">
                  {filteredTasks.length} completed {filteredTasks.length === 1 ? 'task' : 'tasks'}
                </p>
              </div>
              
              {filteredTasks.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleBulkRestore}
                    className="flex items-center gap-2"
                  >
                    <ApperIcon name="RotateCcw" size={16} />
                    Restore All
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2"
                  >
                    <ApperIcon name="Trash2" size={16} />
                    Delete All
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {filteredTasks.length > 0 && (
          <div className="px-6 pb-4">
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading archived tasks...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <ApperIcon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Archive</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button onClick={loadArchivedTasks} variant="primary">
                Try Again
              </Button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="Archive" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Archived Tasks</h3>
              <p className="text-gray-500">
                Completed tasks will appear here for easy restoration
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <ArchiveTaskCard key={task.Id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;