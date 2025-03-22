
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CrawlerFormProps {
  onSubmit: (domains: string[]) => void;
  isLoading: boolean;
  className?: string;
}

const CrawlerForm: React.FC<CrawlerFormProps> = ({ onSubmit, isLoading, className }) => {
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [domains, setDomains] = useState<string[]>([]);
  const [showBulkInput, setShowBulkInput] = useState(false);

  const handleAddDomain = () => {
    if (!domain) return;
    
    const formatted = formatDomain(domain);
    if (!isValidDomain(formatted)) {
      toast({
        title: "Invalid domain",
        description: "Please enter a valid domain name",
        variant: "destructive",
      });
      return;
    }
    
    if (domains.includes(formatted)) {
      toast({
        description: "This domain is already in the list",
        variant: "destructive",
      });
      return;
    }
    
    setDomains([...domains, formatted]);
    setDomain('');
  };

  const handleAddBulkDomains = () => {
    if (!bulkInput.trim()) return;
    
    const newDomains = bulkInput
      .split('\n')
      .map(d => formatDomain(d.trim()))
      .filter(d => d && isValidDomain(d) && !domains.includes(d));
    
    if (newDomains.length === 0) {
      toast({
        description: "No valid new domains found",
        variant: "destructive",
      });
      return;
    }
    
    setDomains([...domains, ...newDomains]);
    setBulkInput('');
    setShowBulkInput(false);
    
    toast({
      description: `Added ${newDomains.length} domains`,
    });
  };

  const handleRemoveDomain = (domain: string) => {
    setDomains(domains.filter(d => d !== domain));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domains.length === 0) {
      toast({
        title: "No domains",
        description: "Please add at least one domain to crawl",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(domains);
  };

  const formatDomain = (domain: string): string => {
    domain = domain.trim().toLowerCase();
    // Remove protocol
    domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
    // Remove paths and query strings
    domain = domain.split('/')[0];
    return domain;
  };

  const isValidDomain = (domain: string): boolean => {
    return /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i.test(domain);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <Card className="w-full border border-border/50 bg-card/70 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">E-commerce Crawler</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter domains to discover product URLs from e-commerce websites
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                placeholder="Enter a domain (e.g., example.com)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="transition-all duration-200 focus-within:shadow-sm"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="button" 
              onClick={handleAddDomain} 
              variant="secondary"
              size="sm"
              disabled={isLoading || !domain}
              className="transition-all duration-200"
            >
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowBulkInput(!showBulkInput)}
              disabled={isLoading}
              className="text-muted-foreground"
            >
              {showBulkInput ? "Hide Bulk" : "Bulk Add"}
            </Button>
          </div>
          
          <AnimatePresence>
            {showBulkInput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 pt-2">
                  <Textarea
                    placeholder="Enter multiple domains (one per line)"
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    className="min-h-[100px] resize-none transition-all duration-200"
                    disabled={isLoading}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddBulkDomains} 
                    variant="outline"
                    size="sm"
                    disabled={isLoading || !bulkInput.trim()}
                    className="w-full transition-all duration-200"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add All Domains
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {domains.length > 0 && (
            <div className="pt-3">
              <Separator className="mb-4" />
              <div className="text-sm font-medium mb-2 text-muted-foreground">
                {domains.length} {domains.length === 1 ? 'domain' : 'domains'} to crawl:
              </div>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {domains.map((d) => (
                    <motion.div
                      key={d}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "py-1 pl-3 pr-2 gap-1",
                          "hover:bg-secondary/80 transition-colors duration-200 group"
                        )}
                      >
                        {d}
                        <button
                          type="button"
                          onClick={() => handleRemoveDomain(d)}
                          disabled={isLoading}
                          className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors ml-1 rounded-full hover:bg-secondary-foreground/10 p-0.5"
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end pt-2">
          <Button 
            type="submit" 
            disabled={isLoading || domains.length === 0} 
            className="px-8 transition-all duration-200"
          >
            Start Crawling
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default CrawlerForm;
