import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppFloat from '../../components/WhatsAppFloat';
import SEO from '../../components/SEO';
import Link from 'next/link';

export default function BlogPost({ post }) {
  if (!post) {
    return (
      <>
        <Navbar />
        <main className="page-main" style={{ padding: '120px 5%', textAlign: 'center' }}>
          <h1>Post not found</h1>
          <Link href="/blog" className="btn-rose"><span>Back to Blog</span></Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${post.title} — Huma Beauty Saloon Jhelum`}
        description={post.excerpt || `Read ${post.title} — beauty tips from Huma Beauty Saloon, Jhelum.`}
        keywords="beauty tips Jhelum, bridal makeup advice, Huma Beauty Saloon blog"
        canonical={`https://humabeautysaloon.site/blog/${post.slug}`}
        ogImage={post.image}
        ogType="article"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt || post.title,
              image: post.image,
              datePublished: post.created_at || undefined,
              author: { '@type': 'Organization', name: 'Huma Beauty Saloon' },
              publisher: {
                '@type': 'Organization',
                name: 'Huma Beauty Saloon',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&q=80',
                },
              },
              mainEntityOfPage: `https://humabeautysaloon.site/blog/${post.slug}`,
            }),
          }}
        />
      </SEO>
      <Navbar />
      <main className="page-main">
        <article className="blog-post-wrap">
          <img src={post.image} alt={post.title} className="blog-post-hero-img" />
          <div className="blog-post-content">
            <Link href="/blog" className="blog-post-back">← Back to Blog</Link>
            <h1>{post.title}</h1>
            <p className="blog-post-body">{post.content}</p>
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const { getBlogPostBySlug } = await import('../../lib/blog');
    const post = await getBlogPostBySlug(params.slug);
    return { props: { post } };
  } catch {
    return { props: { post: null } };
  }
}
