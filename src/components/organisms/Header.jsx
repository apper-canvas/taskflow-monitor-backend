import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ onSearch, onAddTask, className = '' }) => {
  const [showSearch, setShowSearch] = useState(false);
  
  return (
    <motion.header 
      className={`bg-white border-b border-gray-200 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">TaskFlow</h1>
                <p className="text-xs text-gray-500">Effortless productivity</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Desktop Search */}
            <div className="hidden md:block">
              <SearchBar 
                onSearch={onSearch}
                placeholder="Search tasks..."
                className="w-64"
              />
            </div>
            
            {/* Mobile Search Toggle */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              onClick={() => setShowSearch(!showSearch)}
            >
              <ApperIcon name="Search" size={20} />
            </button>
            
            <Button
              onClick={onAddTask}
              variant="primary"
              className="flex items-center gap-2"
            >
              <ApperIcon name="Plus" size={16} />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {showSearch && (
          <motion.div 
            className="md:hidden mt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <SearchBar 
              onSearch={onSearch}
              placeholder="Search tasks..."
            />
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;