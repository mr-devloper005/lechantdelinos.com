import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Find trusted businesses faster',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: '',
    primaryLinks: [
      { label: 'Listings', href: '/listing' },
      { label: 'Submit Business', href: '/create' },
      { label: 'Search', href: '/search' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Explore listings', href: '/listing' },
      secondary: { label: 'Add your business', href: '/create' },
    },
  },
  footer: {
    tagline: 'Verified business discovery',
    description: 'A focused business listing directory for finding service providers, comparing company details, and reaching the right local or online business with confidence.',
    columns: [
      {
        title: 'Directory',
        links: [
          { label: 'All Listings', href: '/listing' },
          { label: 'Search Businesses', href: '/search' },
          { label: 'Submit Business', href: '/create' },
          { label: 'Contact Support', href: '/contact' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Login', href: '/login' },
          { label: 'Sign up', href: '/signup' },
        ],
      },
    ],
    bottomNote: 'Business discovery made clean, practical, and easy to scan.',
  },
  commonLabels: {
    readMore: 'View details',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Similar businesses',
    published: 'Listed',
  },
} as const
