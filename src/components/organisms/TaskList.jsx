import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/molecules/TaskCard';
import Empty from '@/components/ui/Empty';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

const TaskList = ({ 
  tasks = [], 
  loading = false, 
  error = null,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onRetry,
  emptyMessage = "No tasks yet",
  emptyDescription = "Create your first task to get started",
  className = '' 
}) => {
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }
  
  if (tasks.length === 0) {
    return (
      <Empty 
        message={emptyMessage}
        description={emptyDescription}
      />
    );
  }
  
  return (
    <div className={`space-y-3 ${className}`}>
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.2, 
              delay: index * 0.05,
              layout: { duration: 0.2 }
            }}
            layout
          >
            <TaskCard
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              className="group"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;