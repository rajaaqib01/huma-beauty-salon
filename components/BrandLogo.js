import Link from 'next/link';

const LOGO = {
  default: '/images/huma-logo.svg',
  light: '/images/huma-logo-light.svg',
  icon: '/images/huma-logo-icon.svg',
};

export default function BrandLogo({ variant = 'default', href = '/', className = '', priority = false, onClick }) {
  const src = LOGO[variant] || LOGO.default;
  const img = (
    <img
      src={src}
      alt="Huma Beauty Saloon"
      className={`brand-logo brand-logo--${variant}`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );

  if (!href) {
    return <span className={className}>{img}</span>;
  }

  return (
    <Link
      href={href}
      className={`brand-logo-link ${className}`.trim()}
      aria-label="Huma Beauty Saloon — Home"
      onClick={onClick}
    >
      {img}
    </Link>
  );
}
