import { SERVICE_SECTIONS } from './serviceConfig';

/** Public site header navigation — keep in sync with existing pages only. */
export const MAIN_NAV_LINKS = [
  { href: '/', label: 'Home' },
  {
    href: '/services',
    label: 'Service Menu',
    dropdownIncludesParent: false,
    dropdown: [
      { href: '/services', label: 'All Services' },
      ...SERVICE_SECTIONS.map((section) => ({
        href: `/services#${section.id}`,
        label: section.tabLabel || section.category,
      })),
    ],
  },
  { href: '/courses', label: 'Courses' },
  { href: '/offers', label: 'Offers' },
  {
    href: '/team',
    label: 'Team',
    dropdownIncludesParent: false,
    dropdown: [
      { href: '/team', label: 'Our Team' },
      { href: '/gallery', label: 'Gallery' },
      { href: '/reviews', label: 'Reviews' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  { href: '/contact', label: 'Contact' },
];

export const TEAM_SECTION_PATHS = ['/team', '/gallery', '/reviews', '/blog'];
