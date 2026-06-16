import Head from 'next/head';

const SITE_NAME = 'Huma Beauty Saloon';
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80';
const GEO_COORDS = { lat: 32.934, lng: 73.727 };

function publicSalonEmail() {
  const fromPublic = process.env.NEXT_PUBLIC_SALON_EMAIL?.trim();
  if (fromPublic) return fromPublic;
  const fromRecipient = process.env.EMAIL_RECIPIENT?.trim();
  if (fromRecipient) return fromRecipient;
  return '';
}

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  ogUrl,
  twitterCard = 'summary_large_image',
  children,
}) {
  const url = ogUrl || canonical;
  const image = ogImage || DEFAULT_OG_IMAGE;
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  const salonEmail = publicSalonEmail();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: SITE_NAME,
    description,
    url: url || 'https://humabeautysaloon.site/',
    telephone: '+92 335 5462214',
    ...(salonEmail ? { email: salonEmail } : {}),
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Market',
      addressLocality: 'Jhelum',
      addressRegion: 'Punjab',
      postalCode: '49600',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: GEO_COORDS.lat,
      longitude: GEO_COORDS.lng,
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
      'https://humabeautysaloon.site/',
    ],
    image,
    areaServed: {
      '@type': 'City',
      name: 'Jhelum',
    },
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="author" content={SITE_NAME} />
      <meta name="geo.region" content="PK-PB" />
      <meta name="geo.placename" content="Jhelum, Pakistan" />
      <meta name="geo.position" content={`${GEO_COORDS.lat};${GEO_COORDS.lng}`} />
      <meta name="ICBM" content={`${GEO_COORDS.lat}, ${GEO_COORDS.lng}`} />
      {canonical && <link rel="canonical" href={canonical} />}
      {canonical && <link rel="alternate" hrefLang="en-PK" href={canonical} />}

      {googleVerification ? (
        <meta name="google-site-verification" content={googleVerification} />
      ) : null}

      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="en_PK" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={`${SITE_NAME} — ${title}`} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {children}
    </Head>
  );
}
