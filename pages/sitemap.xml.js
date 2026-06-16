import { getPublicBlogPosts } from '../lib/blog'

const SITE_URL = 'https://humabeautysaloon.site'

const STATIC_PAGES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/services', changefreq: 'weekly', priority: '0.9' },
  { path: '/courses', changefreq: 'weekly', priority: '0.85' },
  { path: '/courses/apply', changefreq: 'monthly', priority: '0.8' },
  { path: '/book', changefreq: 'monthly', priority: '0.9' },
  { path: '/offers', changefreq: 'weekly', priority: '0.8' },
  { path: '/gallery', changefreq: 'weekly', priority: '0.8' },
  { path: '/reviews', changefreq: 'weekly', priority: '0.8' },
  { path: '/team', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  { path: '/loyalty', changefreq: 'monthly', priority: '0.5' },
]

function formatUrlEntry({ loc, changefreq, priority, lastmod }) {
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

function generateSitemap(staticPages, blogPosts) {
  const defaultLastmod = new Date().toISOString().split('T')[0]

  const staticUrls = staticPages.map(({ path, changefreq, priority }) =>
    formatUrlEntry({
      loc: `${SITE_URL}${path}`,
      changefreq,
      priority,
      lastmod: defaultLastmod,
    })
  ).join('')

  const blogUrls = blogPosts.map((post) =>
    formatUrlEntry({
      loc: `${SITE_URL}/blog/${post.slug}`,
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: post.created_at
        ? new Date(post.created_at).toISOString().split('T')[0]
        : defaultLastmod,
    })
  ).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${blogUrls}
</urlset>`
}

export async function getServerSideProps({ res }) {
  let blogPosts = []
  try {
    blogPosts = await getPublicBlogPosts()
  } catch (e) {
    console.error('Sitemap blog load error:', e)
  }

  const xml = generateSitemap(STATIC_PAGES, blogPosts)

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
  res.write(xml)
  res.end()
  return { props: {} }
}

export default function Sitemap() {
  return null
}
