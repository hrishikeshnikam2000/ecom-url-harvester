
import { FirecrawlService } from './FirecrawlService';

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

  isValidApiKey(apiKey: string): boolean {
    // Simple validation - in a real app, you would test with an API call
    return apiKey && apiKey.length > 10;
  }
}

export default new CrawlerService();
