import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Checkbox from '@/components/atoms/Checkbox';
import PriorityIndicator from '@/components/molecules/PriorityIndicator';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  className = '' 
}) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const isDueToday = task.dueDate && format(new Date(task.dueDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  
  const handleToggleComplete = () => {
    onToggleComplete?.(task.Id, !task.completed);
  };
  
  return (
    <motion.div
      className={`
        card p-4 border border-gray-100 hover:border-gray-200
        ${task.completed ? 'opacity-75 bg-gray-50' : 'bg-white'}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      layout
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 
                className={`
                  font-medium text-gray-900 mb-1 cursor-pointer hover:text-primary-600 transition-colors
                  ${task.completed ? 'line-through text-gray-500' : ''}
                `}
                onClick={() => onEdit?.(task)}
              >
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-sm text-gray-600 mb-2 ${task.completed ? 'line-through' : ''}`}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center gap-3 text-xs">
                {task.dueDate && (
                  <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : isDueToday ? 'text-amber-600' : 'text-gray-500'}`}>
                    <ApperIcon name="Calendar" size={12} />
                    <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                    {isOverdue && <Badge variant="error" size="xs">Overdue</Badge>}
                    {isDueToday && <Badge variant="warning" size="xs">Today</Badge>}
                  </div>
                )}
                
                {task.listName && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <ApperIcon name="Folder" size={12} />
                    <span>{task.listName}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <PriorityIndicator priority={task.priority} />
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit?.(task)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <ApperIcon name="Edit2" size={14} />
                </button>
                
                <button
                  onClick={() => onDelete?.(task.Id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                >
                  <ApperIcon name="Trash2" size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;