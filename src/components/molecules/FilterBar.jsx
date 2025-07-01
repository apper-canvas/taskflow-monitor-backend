import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  className = '' 
}) => {
  const hasActiveFilters = filters.status !== 'all' || filters.priority !== 'all' || filters.sortBy !== 'dueDate';
  
  return (
    <motion.div 
      className={`flex flex-wrap gap-4 items-center justify-between p-4 bg-surface-50 rounded-lg ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-wrap gap-3 items-center">
        <Select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="min-w-[120px]"
        >
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </Select>
        
        <Select
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          className="min-w-[120px]"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </Select>
        
        <Select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          className="min-w-[120px]"
        >
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="created">Created</option>
          <option value="title">Title</option>
        </Select>
      </div>
      
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="flex items-center gap-2"
        >
          <ApperIcon name="X" size={16} />
          Clear Filters
        </Button>
      )}
    </motion.div>
  );
};

export default FilterBar;