import { getPublicBlogPosts, getBlogPostBySlug } from '../../lib/blog'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }
  try {
    const { slug } = req.query
    if (slug) {
      const post = await getBlogPostBySlug(String(slug))
      if (!post) return res.status(404).json({ error: 'Not found' })
      return res.json(post)
    }
    const posts = await getPublicBlogPosts()
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    return res.json(posts)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
