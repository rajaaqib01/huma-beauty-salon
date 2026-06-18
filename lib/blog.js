import { list as localList } from './localDb'

function slugify(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function fetchBlogPosts() {
  return localList('blog_posts')
}

export async function getPublicBlogPosts() {
  const all = await fetchBlogPosts()
  return all
    .filter(p => p.published !== false)
    .map(p => ({
      id: p.id,
      slug: p.slug || slugify(p.title),
      title: p.title,
      excerpt: p.excerpt || '',
      content: p.content || '',
      image: p.image_url || 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80',
      created_at: p.created_at,
    }))
}

export async function getBlogPostBySlug(slug) {
  const posts = await getPublicBlogPosts()
  return posts.find(p => p.slug === slug) || null
}
