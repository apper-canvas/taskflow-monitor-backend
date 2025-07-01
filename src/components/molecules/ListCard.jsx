import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const ListCard = ({ list, taskCount, className = '' }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/list/${list.Id}`);
  };
  
  return (
    <motion.div
      className={`
        card p-4 cursor-pointer border border-gray-100 hover:border-gray-200
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full border-2"
            style={{ 
              backgroundColor: list.color + '20',
              borderColor: list.color 
            }}
          />
          <div>
            <h3 className="font-medium text-gray-900">{list.name}</h3>
            <p className="text-sm text-gray-500">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {taskCount > 0 && (
            <Badge variant="default">{taskCount}</Badge>
          )}
          <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
        </div>
      </div>
    </motion.div>
  );
};

export default ListCard;