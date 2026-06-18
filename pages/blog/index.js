import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppFloat from '../../components/WhatsAppFloat';
import SEO from '../../components/SEO';
import Link from 'next/link';

export default function BlogIndex({ posts = [] }) {
  return (
    <>
      <SEO
        title="Beauty Tips & Blog — Bridal Makeup Jhelum | Huma Beauty Saloon"
        description="Expert beauty tips, bridal makeup advice and skincare guides from Huma Beauty Saloon in Jhelum. Read salon blogs for weddings and self-care."
        keywords="beauty tips Jhelum, bridal makeup advice, skincare tips salon, wedding beauty blog Pakistan"
        canonical="https://humabeautysaloon.site/blog"
        ogImage="https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1200&q=80"
      />
      <Navbar />
      <main className="page-main">
        <section className="services-page-hero page-hero-theme">
          <div className="services-page-hero-inner">
            <div className="section-label">✦ Beauty Tips</div>
            <h1 className="services-page-hero-title">Salon <em>Blog</em></h1>
            <p className="services-page-hero-text">Expert tips for bridal makeup, skincare and salon care.</p>
          </div>
        </section>
        <section className="offers-section">
          <div className="offers-container">
            <div className="offers-grid blog-grid">
              {posts.map(post => (
                <article key={post.id} className="service-card">
                  <div className="service-card-img-wrap">
                    <img src={post.image} alt={post.title} className="service-card-img" loading="lazy" />
                  </div>
                  <div className="service-card-body">
                    <div className="service-card-name">{post.title}</div>
                    <div className="service-card-desc">{post.excerpt}</div>
                    <div className="service-card-footer">
                      <Link href={`/blog/${post.slug}`} className="btn-rose btn-rose-small"><span>Read More</span></Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export async function getServerSideProps() {
  try {
    const { getPublicBlogPosts } = await import('../../lib/blog');
    return { props: { posts: await getPublicBlogPosts() } };
  } catch {
    return { props: { posts: [] } };
  }
}
