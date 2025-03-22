
import { toast } from "sonner";

interface CrawlResult {
  [domain: string]: string[];
}

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  
  static saveApiKey(apiKey: string): void {
    if (!apiKey) return;
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    console.log('Firecrawl API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async discoverProductUrls(domains: string[]): Promise<CrawlResult> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      toast.error("API key not found. Please enter your Firecrawl API key.");
      throw new Error("API key not found");
    }
    
    // For demo purposes, we'll simulate product URL discovery
    // In a real implementation, this would use the Firecrawl API
    return this.simulateCrawlResults(domains);
  }
  
  // This is a simulation function for demo purposes
  // In a real implementation, this would be replaced with actual API calls
  private static async simulateCrawlResults(domains: string[]): Promise<CrawlResult> {
    const results: CrawlResult = {};
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate dummy product URLs for each domain
    for (const domain of domains) {
      const numProducts = Math.floor(Math.random() * 20) + 5; // 5-25 products
      const productUrls: string[] = [];
      
      // Common product path patterns
      const productPaths = ['product', 'products', 'p', 'item', 'items', 'shop', 'detail'];
      const categoryPaths = ['category', 'collection', 'collections', 'c', 'catalog', 'dept'];
      
      for (let i = 0; i < numProducts; i++) {
        let url = domain;
        
        // Sometimes add category path
        if (Math.random() > 0.5) {
          const category = categoryPaths[Math.floor(Math.random() * categoryPaths.length)];
          const categoryId = Math.floor(Math.random() * 100);
          url += `/${category}/${categoryId}`;
        }
        
        // Add product path
        const productPath = productPaths[Math.floor(Math.random() * productPaths.length)];
        const productId = Math.floor(Math.random() * 100000);
        url += `/${productPath}/${productId}`;
        
        // Sometimes add product slug
        if (Math.random() > 0.7) {
          const slugWords = ['premium', 'deluxe', 'best', 'top', 'new', 'special'];
          const slug = slugWords[Math.floor(Math.random() * slugWords.length)];
          url += `-${slug}-item`;
        }
        
        productUrls.push(url);
      }
      
      results[domain] = productUrls;
    }
    
    return results;
  }
}
