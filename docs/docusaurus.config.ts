import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const GITHUB_URL = 'https://github.com/hivepaas/hivepaas';
const DISCORD_URL = 'https://discord.com/invite/2TgD3zDb2e';
const WEBSITE_URL = 'https://hivepaas.com';
const EDIT_URL = 'https://github.com/hivepaas/hivepaas-website/tree/main/docs/';
// The backend's own spec, at the ref the docs' copy was taken from (see
// scripts/fetch-openapi.mjs).
const OPENAPI_URL = `${GITHUB_URL}/blob/main/docs/openapi/swagger.json`;

const config: Config = {
  title: 'HivePaaS Docs',
  tagline: 'The lightweight, self-hosted PaaS built on Docker Swarm',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://docs.hivepaas.com',
  baseUrl: '/',

  organizationName: 'hivepaas',
  projectName: 'hivepaas-website',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Mermaid diagrams in Markdown: ```mermaid code blocks.
  markdown: {
    mermaid: true,
  },

  headTags: [
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: EDIT_URL,
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/sidebar.css'],
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    'docusaurus-theme-openapi-docs',
    [
      // Offline search: the index is built with the site, nothing to host.
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: ['/docs', '/api'],
        docsDir: ['docs', 'api'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  plugins: [
    'docusaurus-plugin-image-zoom',
    [
      // The API reference: its own docs, at /api, with its own sidebar. Its
      // pages are generated from openapi/hivepaas.json by `yarn api:gen`.
      '@docusaurus/plugin-content-docs',
      {
        id: 'api',
        path: 'api',
        routeBasePath: 'api',
        sidebarPath: './sidebars-api.ts',
        docItemComponent: '@theme/ApiItem',
      },
    ],
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'openapi',
        docsPluginId: 'api',
        config: {
          hivepaas: {
            specPath: 'openapi/hivepaas.json',
            outputDir: 'api',
            downloadUrl: OPENAPI_URL,
            // The spec's server is relative to a HivePaaS install, not to
            // this site, so requests could not be sent from here.
            hideSendButton: true,
            sidebarOptions: {
              groupPathsBy: 'tag',
              categoryLinkSource: 'tag',
            },
          } satisfies OpenApiPlugin.Options,
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      // Dark first, as the landing page is; the reader's own preference wins.
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'HivePaaS',
      logo: {
        alt: 'HivePaaS',
        src: 'img/logo.svg',
        href: WEBSITE_URL,
        target: '_self',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          docsPluginId: 'api',
          position: 'left',
          label: 'API',
        },
        {
          href: DISCORD_URL,
          label: 'Discord',
          position: 'right',
        },
        {
          href: GITHUB_URL,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting started',
              to: '/docs/getting-started/introduction',
            },
            { label: 'Installation', to: '/docs/installation/requirements' },
            {
              label: 'Troubleshooting',
              to: '/docs/troubleshooting/common-issues',
            },
            { label: 'API reference', to: '/api/hivepaas-api' },
            { label: 'Release notes', href: `${GITHUB_URL}/releases` },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'Discord', href: DISCORD_URL },
            { label: 'Discussions', href: `${GITHUB_URL}/discussions` },
            { label: 'Issue tracker', href: `${GITHUB_URL}/issues` },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Website', href: WEBSITE_URL },
            { label: 'GitHub', href: GITHUB_URL },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} HivePaaS. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'yaml', 'toml', 'docker', 'json', 'go'],
    },
    // The request samples on each API page.
    languageTabs: [
      { highlight: 'bash', language: 'curl', logoClass: 'curl' },
      { highlight: 'go', language: 'go', logoClass: 'go' },
      { highlight: 'python', language: 'python', logoClass: 'python' },
      { highlight: 'javascript', language: 'nodejs', logoClass: 'nodejs' },
    ],
    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },
    // Screenshots open full size on click; the logo and icons do not.
    zoom: {
      selector: '.markdown img:not(.no-zoom)',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(4, 5, 8)',
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
