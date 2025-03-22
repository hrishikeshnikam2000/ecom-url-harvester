
import { FirecrawlService } from './FirecrawlService';
import { toast } from "sonner";

interface CrawlOptions {
  maxPages?: number;
  timeout?: number;
  apiKey?: string;
}

class CrawlerService {
  async discoverProductUrls(domains: string[], options: CrawlOptions = {}) {
    try {
      // Save API key if provided
      if (options.apiKey) {
        FirecrawlService.saveApiKey(options.apiKey);
      }
      
      // Use FirecrawlService to discover product URLs
      return await FirecrawlService.discoverProductUrls(domains);
    } catch (error) {
      console.error('Error discovering product URLs:', error);
      throw error;
    }
  }

  isValidApiKey(apiKey: string | null): boolean {
    // If apiKey is null or undefined, consider it valid now (optional)
    if (!apiKey) return true;
    
    // For non-null apiKeys, check validity
    return apiKey.length > 10;
  }
}

export default new CrawlerService();
