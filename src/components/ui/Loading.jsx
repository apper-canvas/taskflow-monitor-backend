import { motion } from 'framer-motion';

const Loading = ({ className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Task Cards Skeleton */}
      {Array.from({ length: 5 }).map((_, index) => (
        <motion.div
          key={index}
          className="card p-4 border border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-start gap-3">
            {/* Checkbox skeleton */}
            <div className="w-5 h-5 bg-gray-200 rounded border mt-1 animate-pulse" />
            
            <div className="flex-1 space-y-2">
              {/* Title skeleton */}
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              
              {/* Description skeleton */}
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              
              {/* Meta info skeleton */}
              <div className="flex items-center gap-4">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
              </div>
            </div>
            
            {/* Priority indicator skeleton */}
            <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;