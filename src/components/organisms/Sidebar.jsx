import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const Sidebar = ({ 
  lists = [], 
  taskCounts = {},
  onAddList,
  className = '' 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLists, setShowLists] = useState(true);
  const location = useLocation();
  
  const navItems = [
    {
      path: '/',
      label: 'All Tasks',
      icon: 'Inbox',
      count: taskCounts.all || 0
    },
    {
      path: '/today',
      label: 'Today',
      icon: 'Calendar',
      count: taskCounts.today || 0
    },
    {
      path: '/upcoming',
      label: 'Upcoming',
      icon: 'Clock',
      count: taskCounts.upcoming || 0
    }
  ];
  
  const NavItem = ({ item, isActive }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-gentle' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }
      `}
    >
      <ApperIcon name={item.icon} size={18} />
      {!isCollapsed && (
        <>
          <span className="flex-1 font-medium">{item.label}</span>
          {item.count > 0 && (
            <Badge 
              variant={isActive ? 'default' : 'secondary'} 
              size="xs"
              className={isActive ? 'bg-white/20 text-white' : ''}
            >
              {item.count}
            </Badge>
          )}
        </>
      )}
    </NavLink>
  );
  
  const ListItem = ({ list }) => {
    const isActive = location.pathname === `/list/${list.Id}`;
    const count = taskCounts[list.Id] || 0;
    
    return (
      <NavLink
        to={`/list/${list.Id}`}
        className={`
          flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-gentle' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
      >
        <div 
          className="w-3 h-3 rounded-full border flex-shrink-0"
          style={{ 
            backgroundColor: isActive ? 'white' : list.color + '40',
            borderColor: isActive ? 'white' : list.color 
          }}
        />
        {!isCollapsed && (
          <>
            <span className="flex-1 font-medium truncate">{list.name}</span>
            {count > 0 && (
              <Badge 
                variant={isActive ? 'default' : 'secondary'} 
                size="xs"
                className={isActive ? 'bg-white/20 text-white' : ''}
              >
                {count}
              </Badge>
            )}
          </>
        )}
      </NavLink>
    );
  };
  
  return (
    <motion.aside
      className={`
        bg-white border-r border-gray-200 flex flex-col h-full
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${className}
      `}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3 }}
    >
      {/* Navigation */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <h2 className="font-semibold text-gray-900">Navigation</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon 
              name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} 
              size={16} 
            />
          </button>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>
      </div>
      
      {/* Lists */}
      <div className="flex-1 p-4 pt-0">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <h2 className="font-semibold text-gray-900">Lists</h2>
          )}
          <div className="flex items-center gap-1">
            {!isCollapsed && (
              <button
                onClick={() => setShowLists(!showLists)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded transition-colors"
              >
                <ApperIcon 
                  name={showLists ? 'ChevronDown' : 'ChevronRight'} 
                  size={14} 
                />
              </button>
            )}
            <button
              onClick={onAddList}
              className="p-1 text-gray-500 hover:text-gray-700 rounded transition-colors"
              title="Add List"
            >
              <ApperIcon name="Plus" size={14} />
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {showLists && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              {lists.map((list) => (
                <ListItem key={list.Id} list={list} />
              ))}
              
              {lists.length === 0 && !isCollapsed && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="FolderPlus" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No lists yet</p>
                  <button
                    onClick={onAddList}
                    className="text-xs text-primary-600 hover:text-primary-700 mt-1"
                  >
                    Create your first list
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Archive Link */}
      <div className="p-4 border-t border-gray-200">
        <NavLink
          to="/archive"
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
            ${isActive 
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-gentle' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
        >
          <ApperIcon name="Archive" size={18} />
          {!isCollapsed && (
            <span className="font-medium">Archive</span>
          )}
        </NavLink>
      </div>
    </motion.aside>
  );
};

export default Sidebar;