
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronUp, Copy, Download, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface UrlListProps {
  results: { [domain: string]: string[] };
  className?: string;
}

const UrlList: React.FC<UrlListProps> = ({ results, className }) => {
  const { toast } = useToast();
  const [openDomains, setOpenDomains] = useState<Set<string>>(new Set());
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  const domains = Object.keys(results);
  const totalUrls = domains.reduce((count, domain) => count + results[domain].length, 0);
  
  const toggleDomain = (domain: string) => {
    const newOpenDomains = new Set(openDomains);
    if (newOpenDomains.has(domain)) {
      newOpenDomains.delete(domain);
    } else {
      newOpenDomains.add(domain);
    }
    setOpenDomains(newOpenDomains);
  };
  
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast({ description: "URL copied to clipboard" });
    
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2000);
  };
  
  const handleDownloadCsv = () => {
    let csv = 'Domain,Product URL\n';
    
    domains.forEach(domain => {
      results[domain].forEach(url => {
        csv += `${domain},"${url}"\n`;
      });
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ecommerce_product_urls.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ description: "Results downloaded as CSV" });
  };
  
  const handleDownloadJson = () => {
    const json = JSON.stringify(results, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ecommerce_product_urls.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ description: "Results downloaded as JSON" });
  };
  
  if (domains.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Card className="w-full border border-border/50 bg-card/70 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-medium">Crawler Results</CardTitle>
              <CardDescription className="text-muted-foreground">
                Found {totalUrls} product URLs across {domains.length} domains
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={handleDownloadCsv}
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={handleDownloadJson}
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {domains.map((domain) => (
              <Collapsible 
                key={domain}
                open={openDomains.has(domain)}
                onOpenChange={() => toggleDomain(domain)}
                className="border rounded-md"
              >
                <CollapsibleTrigger className="w-full flex items-center justify-between p-3 text-left focus:outline-none">
                  <div className="flex items-center">
                    <span className="font-medium">{domain}</span>
                    <Badge 
                      variant="secondary" 
                      className="ml-2 text-xs font-normal"
                    >
                      {results[domain].length}
                    </Badge>
                  </div>
                  <div>
                    {openDomains.has(domain) ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>
                
                <AnimatePresence>
                  {openDomains.has(domain) && (
                    <CollapsibleContent className="overflow-hidden">
                      <Separator />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ScrollArea className="max-h-[300px] overflow-auto">
                          <ul className="py-1">
                            {results[domain].map((url, index) => (
                              <motion.li
                                key={`${domain}-${index}`}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ 
                                  duration: 0.15,
                                  delay: index < 20 ? index * 0.01 : 0 
                                }}
                                className={cn(
                                  "flex items-center gap-2 py-2 px-3 hover:bg-muted/50 transition-colors",
                                  index % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                                )}
                              >
                                <div className="flex-1 text-sm truncate" title={url}>
                                  {url}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-full hover:bg-muted transition-colors"
                                    onClick={() => handleCopyUrl(url)}
                                  >
                                    <Copy className={cn(
                                      "h-3.5 w-3.5", 
                                      copiedUrl === url ? "text-primary" : "text-muted-foreground"
                                    )} />
                                  </Button>
                                  <a
                                    href={`https://${url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center h-7 w-7 rounded-full hover:bg-muted transition-colors"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                  </a>
                                </div>
                              </motion.li>
                            ))}
                          </ul>
                        </ScrollArea>
                      </motion.div>
                    </CollapsibleContent>
                  )}
                </AnimatePresence>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UrlList;
