
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import Header from '@/components/Header';
import CrawlerForm from '@/components/CrawlerForm';
import UrlList from '@/components/UrlList';
import LoadingState from '@/components/LoadingState';
import crawlerService from '@/utils/crawlerService';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ [domain: string]: string[] }>({});
  const [showResults, setShowResults] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  const handleCrawl = async (domains: string[]) => {
    if (!crawlerService.isValidApiKey(localStorage.getItem('firecrawl_api_key') || '')) {
      setShowApiKeyDialog(true);
      return;
    }
    
    setIsLoading(true);
    setShowResults(false);
    
    try {
      const crawlResults = await crawlerService.discoverProductUrls(domains);
      setResults(crawlResults);
      setShowResults(true);
    } catch (error) {
      console.error('Crawl error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApiKeySubmit = async () => {
    if (!crawlerService.isValidApiKey(apiKey)) {
      // In a real app, you would validate the API key with a test request
      alert('Please enter a valid API key');
      return;
    }
    
    localStorage.setItem('firecrawl_api_key', apiKey);
    setShowApiKeyDialog(false);
    
    // Re-trigger the crawl with the domains from the form
    // In a real app, you would store the domains before showing the API key dialog
    const domainsInput = document.querySelector('input[placeholder*="domain"]') as HTMLInputElement;
    if (domainsInput && domainsInput.value) {
      handleCrawl([domainsInput.value]);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <Toaster position="top-center" />
      <Header />
      
      <main className="container max-w-screen-xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center max-w-2xl mx-auto mb-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <h1 className="text-4xl font-medium tracking-tight mb-4">
                E-commerce Product URL Discovery
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p className="text-muted-foreground text-lg">
                Automatically discover and extract product URLs from any e-commerce website
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl mx-auto">
              <CrawlerForm 
                onSubmit={handleCrawl}
                isLoading={isLoading}
              />
            </div>
            
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full pt-8"
                >
                  <LoadingState 
                    isLoading={isLoading}
                    text="Crawling e-commerce websites and discovering product URLs..."
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {showResults && Object.keys(results).length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="w-full max-w-3xl mx-auto mt-10"
                >
                  <UrlList results={results} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
      
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Firecrawl API Key</DialogTitle>
            <DialogDescription>
              You need to provide your Firecrawl API key to use the crawler functionality.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Your Firecrawl API key"
              className="w-full"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApiKeyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApiKeySubmit}>
              Save & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
