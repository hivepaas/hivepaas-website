// Addresses the landing site links to from more than one page.

export const SITE_URL = 'https://hivepaas.com';
export const DOCS_URL = 'https://docs.hivepaas.com';
export const PORTAL_URL = 'https://portal.hivepaas.com';
export const GITHUB_URL = 'https://github.com/hivepaas/hivepaas';
export const DISCORD_URL = 'https://discord.com/invite/2TgD3zDb2e';

// The docs' section on plans, license keys, renewal and turning it off.
export const DOCS_PLANS_URL = `${DOCS_URL}/plans-and-licenses`;

// Where a customer asks for Apiary, which is sold by contact and not through
// the checkout: sales@; support@ is for everything else (legal.ts).
// portal-web's CONTACT_SALES_URL uses the same address.
export const SALES_EMAIL = 'sales@hivepaas.com';
export const SALES_MAILTO = `mailto:${SALES_EMAIL}?subject=HivePaaS%20Apiary`;

// The other apps from the same hive, for the navbar's Products menu and the
// footer. Each has its own landing site; the icons are their app icons,
// copied into public/products/.
export const SHELLWING_URL = 'https://shellwing.app';
export const TRACEWING_URL = 'https://tracewing.app';
export const PACKWING_URL = 'https://packwing.app';

export interface Product {
  name: string;
  href: string;
  icon: string;
  tagline: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    name: 'shellwing',
    href: SHELLWING_URL,
    icon: '/products/shellwing.svg',
    tagline: 'SSH client',
    description:
      'Tabs, split panes, SFTP and port forwarding in a GPU-rendered terminal, with an encrypted vault that syncs between your devices.',
  },
  {
    name: 'tracewing',
    href: TRACEWING_URL,
    icon: '/products/tracewing.svg',
    tagline: 'HTTP debugging proxy',
    description:
      'See, pause and change every request your mobile apps, desktop apps, servers and AI agents make — what DevTools cannot reach.',
  },
  {
    name: 'packwing',
    href: PACKWING_URL,
    icon: '/products/packwing.svg',
    tagline: 'File archiver',
    description:
      'ZIP, 7z, tar.xz and tar.zst made and opened on all of your cores at once. RAR, disc images and age files, opened safely.',
  },
];
