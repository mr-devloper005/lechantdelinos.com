import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Find trusted businesses and local services',
      description: 'Browse business listings, compare company details, and connect with service providers through a clean directory experience.',
      openGraphTitle: 'Find trusted businesses and local services',
      openGraphDescription: 'A focused business listing directory for discovery, comparison, and quick contact.',
      keywords: ['business directory', 'business listings', 'local services', 'company directory'],
    },
    hero: {
      badge: 'Business discovery made simple',
      title: ['Find the right business', 'without the noisy search.'],
      description: 'Explore organized business listings with locations, contact details, categories, service summaries, and quick actions built for real comparison.',
      primaryCta: { label: 'Explore listings', href: '/listing' },
      secondaryCta: { label: 'Add your business', href: '/create' },
      searchPlaceholder: 'Search by business, service, city, or category',
      focusLabel: 'Directory',
      featureCardBadge: 'verified directory flow',
      featureCardTitle: 'Listings, profiles, contacts, and service details in one clean browsing surface.',
      featureCardDescription: 'Designed for visitors who want to scan fast, compare clearly, and reach businesses without extra friction.',
    },
    intro: {
      badge: 'Why this directory works',
      title: 'A business listing platform built around clarity, trust, and action.',
      paragraphs: [
        'Visitors come to a directory because they need answers: who offers the service, where they operate, how to contact them, and why they are worth considering.',
        'The experience keeps those answers close to the surface with compact cards, clear categories, practical summaries, and detail pages that make contact paths obvious.',
        'For businesses, the platform gives every listing a structured place to present services, location, images, website links, and supporting information.',
      ],
      sideBadge: 'Directory essentials',
      sidePoints: [
        'Clean category browsing for faster service discovery.',
        'Business cards tuned for comparison and quick scanning.',
        'Detail pages with contact actions, maps, images, and summaries.',
        'Account access for submitting and managing business information.',
      ],
      primaryLink: { label: 'Browse listings', href: '/listing' },
      secondaryLink: { label: 'Contact support', href: '/contact' },
    },
    cta: {
      badge: 'List with confidence',
      title: 'Put your business where people are already searching.',
      description: 'Create a focused listing with your services, contact details, location, images, and the essentials customers need before they reach out.',
      primaryCta: { label: 'Create listing', href: '/create' },
      secondaryCta: { label: 'Search directory', href: '/search' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse fresh business listings and directory updates.',
    },
  },
  about: {
    badge: 'About the directory',
    title: 'Business discovery should feel organized, trustworthy, and quick.',
    description: `${slot4BrandConfig.siteName} helps visitors find relevant businesses and service providers through a cleaner listing experience built for comparison.`,
    paragraphs: [
      'The directory brings business information into one practical flow: service categories, locations, contact details, websites, images, summaries, and supporting descriptions.',
      'Instead of asking visitors to open tab after tab, the site gives them a clear archive, searchable results, and detail pages that surface the most useful information first.',
      'For business owners, the goal is simple: create a listing that looks professional, explains what you do, and gives potential customers a direct path to act.',
    ],
    values: [
      {
        title: 'Clear comparison',
        description: 'Structured cards and detail pages help visitors compare businesses by category, location, services, and contact options.',
      },
      {
        title: 'Trust-forward details',
        description: 'Each listing is shaped around practical signals: summary, business identity, images, map context, phone, email, and website links.',
      },
      {
        title: 'Simple submission flow',
        description: 'Members can create listings with the essentials customers expect, without turning the process into a heavy publishing system.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Need help with a business listing, category, or account?',
    description: 'Send the details and we will help with listing updates, directory categories, business profile questions, contact issues, or onboarding support.',
    formTitle: 'Tell us about your listing',
  },

  search: {
    metadata: {
      title: 'Search businesses',
      description: 'Search business listings by keyword, category, service, city, or company name.',
    },
    hero: {
      badge: 'Search the directory',
      title: 'Find businesses by service, category, or location.',
      description: 'Use focused filters and keyword search to surface relevant business listings from the active directory.',
      placeholder: 'Search business name, city, service, or category',
    },
    resultsTitle: 'Latest business listings',
  },
  create: {
    metadata: {
      title: 'Create a business listing',
      description: 'Create and submit a business listing for the directory.',
    },
    locked: {
      badge: 'Listing access',
      title: 'Login to submit your business listing.',
      description: 'Use your account to add company details, contact information, service categories, images, and a clear business description.',
    },
    hero: {
      badge: 'Business listing workspace',
      title: 'Create a listing customers can trust.',
      description: 'Choose the business listing type, add service details, include contact paths, and prepare a professional directory profile.',
    },
    formTitle: 'Business details',
    submitLabel: 'Submit listing',
    successTitle: 'Business listing saved successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login to manage business listings and submissions.',
      badge: 'Member access',
      title: 'Welcome back to your business dashboard.',
      description: 'Login to create listings, update saved business information, and continue managing your directory submissions.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an account to submit business listings.',
      badge: 'Directory account',
      title: 'Create an account and list your business.',
      description: 'Sign up to submit business profiles, save listing drafts, and make your services easier for customers to discover.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Similar businesses',
      fallbackTitle: 'Business listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
