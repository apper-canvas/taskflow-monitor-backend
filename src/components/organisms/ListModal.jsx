import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const ListModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  list = null,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#6366f1',
    icon: 'Folder'
  });
  
  const [errors, setErrors] = useState({});
  
  const colorOptions = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
    '#f59e0b', '#10b981', '#3b82f6', '#8b5a2b'
  ];
  
  const iconOptions = [
    'Folder', 'Star', 'Heart', 'Briefcase',
    'Home', 'User', 'Coffee', 'Zap'
  ];
  
  useEffect(() => {
    if (list) {
      setFormData({
        name: list.name || '',
        color: list.color || '#6366f1',
        icon: list.icon || 'Folder'
      });
    } else {
      setFormData({
        name: '',
        color: '#6366f1',
        icon: 'Folder'
      });
    }
    setErrors({});
  }, [list, isOpen]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'List name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSave(formData);
  };
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg shadow-floating w-full max-w-md"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {list ? 'Edit List' : 'Create New List'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="List Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter list name..."
                autoFocus
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`
                        w-8 h-8 rounded-full border-2 transition-all
                        ${formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200 hover:border-gray-300'}
                      `}
                      style={{ backgroundColor: color }}
                      onClick={() => handleChange('color', color)}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`
                        p-3 rounded-lg border transition-all
                        ${formData.icon === icon 
                          ? 'border-primary-500 bg-primary-50 text-primary-600' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }
                      `}
                      onClick={() => handleChange('icon', icon)}
                    >
                      <ApperIcon name={icon} size={20} className="mx-auto" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading}
                >
                  {list ? 'Update List' : 'Create List'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ListModal;