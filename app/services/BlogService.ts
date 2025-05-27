export interface BlogPost {
  id: string;
  title: string;
  source: string;
  url: string;
  image: string;
  date: string;
  excerpt: string;
  author?: string;
}

// Only include websites that have proper blog sections
const API_ENDPOINTS = {
  '3D Printing Industry': {
    url: 'https://3dprintingindustry.com/feed/json',
    type: 'rss',
    hasBlog: true
  },
  'All3DP': {
    url: 'https://all3dp.com/feed/json',
    type: 'rss',
    hasBlog: true
  },
  '3D Insider': {
    url: 'https://3dinsider.com/feed/json',
    type: 'rss',
    hasBlog: true
  },
  'Sculpteo': {
    url: 'https://www.sculpteo.com/blog/feed/json',
    type: 'rss',
    hasBlog: true
  },
  '3D Printing Media': {
    url: 'https://www.3dprintingmedia.network/feed/json',
    type: 'rss',
    hasBlog: true
  }
};

// Websites that don't have proper blog sections or are not accessible
const EXCLUDED_WEBSITES: string[] = [];

class BlogService {
  private static instance: BlogService;

  private constructor() {}

  public static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  // Parse RSS feed content
  private async fetchRSSContent(source: string, apiUrl: string): Promise<BlogPost[]> {
    try {
      // We'll use fallback content since RSS feeds require server-side proxies
      // In a production app, you would use a server to fetch and parse RSS feeds
      return this.getSourceFallbackContent(source);
    } catch (error) {
      console.error(`Error fetching content from ${source}:`, error);
      return this.getSourceFallbackContent(source);
    }
  }

  // Get fallback content for a specific source
  private getSourceFallbackContent(source: string): BlogPost[] {
    const fallbackContent: Record<string, BlogPost[]> = {
      '3D Printing Industry': [
        {
          id: '3dpi-1',
          title: 'Latest Advancements in Metal 3D Printing',
          source: '3D Printing Industry',
          url: 'https://3dprintingindustry.com/news/category/metal',
          image: 'https://via.placeholder.com/400x200/00B5AD/FFFFFF?text=Metal+3D+Printing',
          date: new Date().toLocaleDateString(),
          excerpt: 'Exploring the latest developments in metal 3D printing technology and their applications in aerospace and automotive industries...',
        },
        {
          id: '3dpi-2',
          title: 'New Materials for Bioprinting Applications',
          source: '3D Printing Industry',
          url: 'https://3dprintingindustry.com/news/category/medical',
          image: 'https://via.placeholder.com/400x200/00B5AD/FFFFFF?text=Bioprinting',
          date: new Date(Date.now() - 86400000).toLocaleDateString(), // Yesterday
          excerpt: 'Researchers have developed new biocompatible materials that could revolutionize tissue engineering and organ printing...',
        }
      ],
      'All3DP': [
        {
          id: 'all3dp-1',
          title: 'Best 3D Printers of 2023',
          source: 'All3DP',
          url: 'https://all3dp.com/1/best-3d-printer',
          image: 'https://via.placeholder.com/400x200/4CAF50/FFFFFF?text=Best+3D+Printers',
          date: new Date().toLocaleDateString(),
          excerpt: 'A comprehensive guide to the best 3D printers for beginners, professionals, and everyone in between...',
        },
        {
          id: 'all3dp-2',
          title: '3D Printing Filament Guide',
          source: 'All3DP',
          url: 'https://all3dp.com/1/3d-printer-filament-types-3d-printing-3d-filament',
          image: 'https://via.placeholder.com/400x200/4CAF50/FFFFFF?text=Filament+Guide',
          date: new Date(Date.now() - 172800000).toLocaleDateString(), // 2 days ago
          excerpt: 'Everything you need to know about 3D printing filaments, from PLA and ABS to exotic materials like wood and metal-infused filaments...',
        }
      ],
      '3D Insider': [
        {
          id: '3dins-1',
          title: 'Advanced 3D Printing Techniques',
          source: '3D Insider',
          url: 'https://3dinsider.com/3d-printing-techniques',
          image: 'https://via.placeholder.com/400x200/2196F3/FFFFFF?text=Advanced+Techniques',
          date: new Date(Date.now() - 259200000).toLocaleDateString(), // 3 days ago
          excerpt: 'Deep dive into advanced 3D printing techniques and how to master them for professional-quality prints...',
        },
        {
          id: '3dins-2',
          title: 'How to Calibrate Your 3D Printer',
          source: '3D Insider',
          url: 'https://3dinsider.com/calibrate-3d-printer',
          image: 'https://via.placeholder.com/400x200/2196F3/FFFFFF?text=Calibration',
          date: new Date(Date.now() - 345600000).toLocaleDateString(), // 4 days ago
          excerpt: 'Step-by-step guide to perfectly calibrate your 3D printer for optimal print quality and reliability...',
        }
      ],
      'Sculpteo': [
        {
          id: 'sculpteo-1',
          title: 'Industrial 3D Printing Applications',
          source: 'Sculpteo',
          url: 'https://www.sculpteo.com/blog/industrial-3d-printing-applications',
          image: 'https://via.placeholder.com/400x200/9C27B0/FFFFFF?text=Industrial+Applications',
          date: new Date(Date.now() - 129600000).toLocaleDateString(), // 1.5 days ago
          excerpt: 'How 3D printing is transforming industrial manufacturing processes and enabling new possibilities...',
        }
      ],
      '3D Printing Media': [
        {
          id: '3dpm-1',
          title: 'The Future of 3D Printed Electronics',
          source: '3D Printing Media',
          url: 'https://www.3dprintingmedia.network/news/future-3d-printed-electronics',
          image: 'https://via.placeholder.com/400x200/2196F3/FFFFFF?text=3D+Printed+Electronics',
          date: new Date(Date.now() - 216000000).toLocaleDateString(), // 2.5 days ago
          excerpt: 'Latest innovations in 3D printed electronic components and circuits that are revolutionizing the electronics industry...',
        }
      ]
    };

    return fallbackContent[source] || [];
  }

  // Fallback content in case API calls fail
  private getFallbackContent(): BlogPost[] {
    return [
      {
        id: '1',
        title: 'Latest Trends in 3D Printing Technology',
        source: '3D Printing Industry',
        url: 'https://3dprintingindustry.com/news',
        image: 'https://via.placeholder.com/400x200/00B5AD/FFFFFF?text=3D+Printing+Trends',
        date: new Date().toLocaleDateString(),
        excerpt: 'Exploring the latest developments in 3D printing technology and their impact on various industries...',
      },
      {
        id: '2',
        title: 'Best 3D Printers for Beginners',
        source: 'All3DP',
        url: 'https://all3dp.com',
        image: 'https://via.placeholder.com/400x200/4CAF50/FFFFFF?text=3D+Printers+Guide',
        date: new Date(Date.now() - 86400000).toLocaleDateString(), // Yesterday
        excerpt: 'A comprehensive guide to choosing your first 3D printer, with recommendations for different budgets and needs...',
      },
      {
        id: '3',
        title: 'Advanced 3D Printing Techniques',
        source: '3D Insider',
        url: 'https://3dinsider.com',
        image: 'https://via.placeholder.com/400x200/2196F3/FFFFFF?text=Advanced+Techniques',
        date: new Date(Date.now() - 172800000).toLocaleDateString(), // 2 days ago
        excerpt: 'Deep dive into advanced 3D printing techniques and how to master them...',
      },
      {
        id: '4',
        title: '3D Printing in Healthcare',
        source: '3D Printing Industry',
        url: 'https://3dprintingindustry.com/news/category/medical',
        image: 'https://via.placeholder.com/400x200/FF5722/FFFFFF?text=Healthcare',
        date: new Date(Date.now() - 259200000).toLocaleDateString(), // 3 days ago
        excerpt: 'How 3D printing is revolutionizing healthcare with custom implants, prosthetics, and even bioprinting...',
      },
      {
        id: '5',
        title: 'Industrial 3D Printing Applications',
        source: 'Sculpteo',
        url: 'https://www.sculpteo.com/blog/industrial-3d-printing-applications',
        image: 'https://via.placeholder.com/400x200/9C27B0/FFFFFF?text=Industrial+Applications',
        date: new Date(Date.now() - 345600000).toLocaleDateString(), // 4 days ago
        excerpt: 'Real-world applications of industrial 3D printing technologies across different sectors...',
      }
    ];
  }

  public async fetchAllContent(): Promise<BlogPost[]> {
    try {
      const promises = Object.entries(API_ENDPOINTS)
        .filter(([source, endpoint]) => endpoint.hasBlog && !EXCLUDED_WEBSITES.includes(source))
        .map(([source, endpoint]) => {
          if (endpoint.type === 'rss') {
            return this.fetchRSSContent(source, endpoint.url);
          }
          return Promise.resolve([]);
        });

      const results = await Promise.all(promises);
      let allPosts = results.flat();

      // If no posts were fetched, use fallback content
      if (allPosts.length === 0) {
        allPosts = this.getFallbackContent();
      }

      // Sort by date
      return allPosts.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error('Error fetching all content:', error);
      return this.getFallbackContent();
    }
  }
}

export default BlogService.getInstance(); 