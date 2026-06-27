import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shipcartstore.pk';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Try to fetch dynamic products to include them in the sitemap
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${SITE_URL}/api/products?limit=1000`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.products) {
        productEntries = data.products.map((product: any) => ({
          url: `${SITE_URL}/products/${product.slug}`,
          lastModified: new Date(product.updatedAt || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
      }
    }
  } catch (error) {
    console.error('Sitemap generation failed to fetch products:', error);
  }

  // Define static routes
  const staticRoutes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    // Add other static pages like /about, /contact, etc., if they exist.
  ];

  return [...staticRoutes, ...productEntries];
}
