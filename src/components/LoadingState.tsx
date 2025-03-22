
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  isLoading: boolean;
  className?: string;
  text?: string;
}

const LoadingState = ({ isLoading, className, text = "Processing..." }: LoadingStateProps) => {
  if (!isLoading) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex flex-col items-center justify-center p-8 w-full",
        className
      )}
    >
      <div className="relative">
        <motion.div 
          className="h-16 w-16 rounded-full border-t-2 border-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute top-0 h-16 w-16 rounded-full border-r-2 border-primary/30"
          animate={{ rotate: -120 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <motion.p 
        className="text-muted-foreground mt-4 text-sm font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {text}
      </motion.p>
      
      <motion.div 
        className="mt-8 w-full max-w-xs bg-muted h-1 rounded-full overflow-hidden"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: [0.33, 1, 0.68, 1]
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default LoadingState;
