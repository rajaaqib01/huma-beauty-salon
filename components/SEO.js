import Head from 'next/head';

export default function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  ogUrl,
  twitterCard = 'summary_large_image',
  children,
}) {
  const siteName = 'Huma Beauty Saloon';
  const url = ogUrl || canonical;
  const image = ogImage || 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: siteName,
    description,
    url,
    telephone: '+92 335 5462214',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Market',
      addressLocality: 'Jhelum',
      addressRegion: 'Punjab',
      addressCountry: 'PK',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
        ],
        opens: '09:00',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '10:00',
        closes: '19:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/huma_beauty.saloon/',
      'https://www.tiktok.com/@humabeautysaloonjhe',
    ],
    image,
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {children}
    </Head>
  );
}
