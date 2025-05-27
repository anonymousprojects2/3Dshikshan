interface BlogPost {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

interface WebsiteData {
  title: string;
  description: string;
  url: string;
  sections: {
    main: string;
    blog: string;
    news?: string;
    guides?: string;
    resources?: string;
  };
  latestBlogs: BlogPost[];
}

export const WEBSITES: WebsiteData[] = [
  {
    title: '3D Printing Industry',
    description: 'Latest news in 3D printing technology',
    url: 'https://3dprintingindustry.com',
    sections: {
      main: 'https://3dprintingindustry.com',
      blog: 'https://3dprintingindustry.com/news',
      news: 'https://3dprintingindustry.com/news/category/industry-news',
    },
    latestBlogs: [
      {
        title: 'Sunlu FilaDryer S2 Review',
        description: 'Technical specifications and pricing of the new filament drying system',
        imageUrl: 'https://3dprintingindustry.com/wp-content/uploads/2023/06/sunlu-filadryer-s2-featured.jpg',
        url: 'https://3dprintingindustry.com/news/sunlu-filadryer-s2-review-technical-specifications-pricing-223774/',
      },
      {
        title: 'Automatic Exposure System for Volumetric 3D Printing',
        description: 'New research in volumetric additive manufacturing',
        imageUrl: 'https://3dprintingindustry.com/wp-content/uploads/2023/05/volumetric-3d-printing-research.jpg',
        url: 'https://3dprintingindustry.com/news/researchers-develop-automatic-exposure-system-volumetric-3d-printing-223756/',
      }
    ]
  },
  {
    title: '3D Printing.com',
    description: 'Everything about 3D printing',
    url: 'https://3dprinting.com',
    sections: {
      main: 'https://3dprinting.com',
      blog: 'https://3dprinting.com/news',
      guides: 'https://3dprinting.com/how-to',
    },
    latestBlogs: [
      {
        title: 'Latest Advances in Metal 3D Printing',
        description: 'New developments in metal additive manufacturing',
        imageUrl: 'https://3dprinting.com/wp-content/uploads/2023/metal-3d-printing.jpg',
        url: 'https://3dprinting.com/news/metal-3d-printing-advances-2023',
      }
    ]
  },
  {
    title: 'All3DP',
    description: '3D printing guides and reviews',
    url: 'https://all3dp.com',
    sections: {
      main: 'https://all3dp.com',
      blog: 'https://all3dp.com/1/3d-printing-news',
      guides: 'https://all3dp.com/2/3d-printing-guides',
    },
    latestBlogs: [
      {
        title: 'Best 3D Printers of 2023',
        description: 'Comprehensive guide to this year\'s top 3D printers',
        imageUrl: 'https://cdn.all3dp.com/wp-content/uploads/2023/01/03152857/best-3d-printer-lead-fixed.jpg',
        url: 'https://all3dp.com/1/best-3d-printer/',
      }
    ]
  },
  {
    title: '3D Printing Media',
    description: 'Professional 3D printing news',
    url: 'https://www.3dprintingmedia.network',
    sections: {
      main: 'https://www.3dprintingmedia.network',
      blog: 'https://www.3dprintingmedia.network/news',
      news: 'https://www.3dprintingmedia.network/category/industry',
    },
    latestBlogs: [
      {
        title: 'The Future of 3D Printed Electronics',
        description: 'Latest innovations in 3D printed electronic components',
        imageUrl: 'https://www.3dprintingmedia.network/wp-content/uploads/2023/06/3d-printed-electronics.jpg',
        url: 'https://www.3dprintingmedia.network/news/future-3d-printed-electronics',
      }
    ]
  },
  {
    title: 'Sculpteo',
    description: '3D printing services and resources',
    url: 'https://www.sculpteo.com',
    sections: {
      main: 'https://www.sculpteo.com',
      blog: 'https://www.sculpteo.com/blog',
      resources: 'https://www.sculpteo.com/en/3d-learning-hub',
    },
    latestBlogs: [
      {
        title: 'Industrial 3D Printing Applications',
        description: 'Real-world applications of industrial 3D printing',
        imageUrl: 'https://www.sculpteo.com/blog/wp-content/uploads/2023/05/industrial-3d-printing.jpg',
        url: 'https://www.sculpteo.com/blog/industrial-3d-printing-applications',
      }
    ]
  },
  {
    title: '3D Insider',
    description: 'In-depth 3D printing coverage',
    url: 'https://3dinsider.com',
    sections: {
      main: 'https://3dinsider.com',
      blog: 'https://3dinsider.com/category/news',
      guides: 'https://3dinsider.com/category/guides',
    },
    latestBlogs: [
      {
        title: 'Advanced 3D Printing Materials Guide',
        description: 'Complete guide to modern 3D printing materials',
        imageUrl: 'https://3dinsider.com/wp-content/uploads/2023/06/3d-printing-materials.jpg',
        url: 'https://3dinsider.com/3d-printing-materials/',
      }
    ]
  },
] as const;

export type Website = typeof WEBSITES[number];
export { BlogPost };

// Default export for the URLs
const urls = {
  WEBSITES
};

export default urls;

 