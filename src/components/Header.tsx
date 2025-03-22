
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Header = ({ className }: { className?: string }) => {
  return (
    <header className={cn("w-full py-6 px-4", className)}>
      <div className="container max-w-screen-xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-center justify-between"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/90 flex items-center justify-center text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                <line x1="16" y1="8" x2="2" y2="22"></line>
                <line x1="17.5" y1="15" x2="9" y2="15"></line>
              </svg>
            </div>
            <h1 className="text-xl font-medium tracking-tight">EcomCrawler</h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p className="text-sm text-muted-foreground">Discover E-commerce Product URLs</p>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
