import client from '@/lib/contentful';
import type { MetadataRoute } from 'next'
 


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {


  const response = await client.getEntries({ content_type: "pageBlogPost" });
  const allBlogIds = response.items.map((blog: any) => blog.fields.slug);

  const allBlogPages = allBlogIds.map((blogId: string) => {
    return {
      url: `https://distanceconnect.in/blog/${blogId}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    };
  }).flat() as MetadataRoute.Sitemap;

  return [
    {
      url: 'https://distanceconnect.in',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://distanceconnect.in/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://distanceconnect.in/mentors',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://distanceconnect.in/solutions/student',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://distanceconnect.in/solutions/mentor',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...allBlogPages,
  ]
}