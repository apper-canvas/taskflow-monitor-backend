import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      className={`relative inline-flex items-center ${className}`}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <div
        className={`
          w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200
          ${checked 
            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 border-primary-500' 
            : 'bg-white border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && onChange?.(!checked)}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon name="Check" size={12} className="text-white" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Checkbox;