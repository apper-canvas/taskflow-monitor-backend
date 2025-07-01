import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const PriorityIndicator = ({ priority, showLabel = false, className = '' }) => {
  const priorityConfig = {
    high: {
      color: 'text-red-500',
      bg: 'bg-red-100',
      border: 'border-red-200',
      icon: 'AlertCircle',
      label: 'High Priority',
      pulse: true
    },
    medium: {
      color: 'text-amber-500',
      bg: 'bg-amber-100',
      border: 'border-amber-200',
      icon: 'Circle',
      label: 'Medium Priority',
      pulse: false
    },
    low: {
      color: 'text-green-500',
      bg: 'bg-green-100',
      border: 'border-green-200',
      icon: 'Minus',
      label: 'Low Priority',
      pulse: false
    }
  };
  
  const config = priorityConfig[priority] || priorityConfig.low;
  
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <motion.div
        className={`
          w-3 h-3 rounded-full border flex items-center justify-center
          ${config.bg} ${config.border} ${config.color}
          ${config.pulse ? 'priority-pulse' : ''}
        `}
        animate={config.pulse ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ApperIcon name={config.icon} size={8} />
      </motion.div>
      {showLabel && (
        <span className={`text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      )}
    </div>
  );
};

export default PriorityIndicator;