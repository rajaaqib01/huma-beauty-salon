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
      <SEO title={`${post.title} — Huma Beauty Saloon`} description={post.excerpt} canonical={`https://humabeautysaloon.site/blog/${post.slug}`} ogImage={post.image} />
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
