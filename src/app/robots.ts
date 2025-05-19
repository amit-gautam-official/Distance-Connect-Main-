import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/blog', '/mentors', '/solutions/student', '/solutions/mentor'],
      disallow: ['/api', '/_next', '/static'],
    },
    sitemap: 'https://distanceconnect.in/sitemap.xml',
  }
}