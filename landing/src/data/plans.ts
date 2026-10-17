// The plans: the one source for the pricing page's cards, its table and its
// structured data, and for the numbers the landing page's FAQ quotes.
//
// They must agree with, and change together with:
// - the licensing spec's Plans table
//   (hivepaas/docs/superpowers/specs/2026-10-16-licensing-design.md);
// - Bee's limits compiled into HivePaaS
//   (hivepaas/hivepaas_app/pkg/license/limits.go);
// - the portal's base.PlanLimits, which go into the keys it signs;
// - the Paddle catalog's USD prices (499/4799, 1299/12499, 2499/23999 cents).
import { PORTAL_URL } from './site';

export type PlanId = 'bee' | 'comb' | 'hive' | 'colony' | 'apiary';
export type Period = 'monthly' | 'yearly';

/** A limit: a number, no limit at all, or set on each key (Apiary). */
export type Limit = number | 'none' | 'per-key';

export interface PlanLimits {
  nodes: Limit;
  users: Limit;
  apps: Limit;
  functions: Limit;
  /** Pull request previews that exist at the same time. */
  previews: Limit;
  /** Installations one key works for. */
  installations: Limit;
}

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  /** USD before tax; null for Bee (free) and Apiary (quoted). */
  prices: Record<Period, number> | null;
  limits: PlanLimits;
  /** Every sign-in provider, or only Bee's code hosts. */
  allSignIn: boolean;
  /** A free trial from the portal, without a card. */
  trialDays?: number;
}

/** A yearly price is about this much off twelve monthly ones. */
export const YEARLY_DISCOUNT_PERCENT = 20;
export const TRIAL_DAYS = 14;
/** Days a paid key keeps working after the period paid for. A trial has none. */
export const GRACE_DAYS = 30;
/** Days Paddle retries a failed renewal, at most: GRACE_DAYS covers them. */
export const PAYMENT_RETRY_DAYS = 30;
/** Moves of a license to another installation, in any 365 days. */
export const MOVES_PER_YEAR = 10;
/** A full refund on request within this many days of a payment. */
export const REFUND_DAYS = 14;

/** The sign-in providers Bee has: the code hosts. */
export const BEE_SIGN_IN = ['GitHub', 'GitHub App', 'GitLab', 'Gitea'];
/** The ones a paid plan adds. */
export const PAID_SIGN_IN = ['Google', 'Microsoft', 'OpenID Connect'];

const unlimited = {
  apps: 'none',
  functions: 'none',
  previews: 'none',
} as const;

export const plans: Plan[] = [
  {
    id: 'bee',
    name: 'Bee',
    tagline: 'What HivePaaS runs without a key.',
    prices: null,
    limits: {
      nodes: 2,
      users: 2,
      apps: 20,
      functions: 20,
      previews: 2,
      installations: 1,
    },
    allSignIn: false,
  },
  {
    id: 'comb',
    name: 'Comb',
    tagline: 'A small team on a few nodes.',
    prices: { monthly: 4.99, yearly: 47.99 },
    limits: { nodes: 5, users: 5, ...unlimited, installations: 1 },
    allSignIn: true,
  },
  {
    id: 'hive',
    name: 'Hive',
    tagline: 'A growing team, with room to scale.',
    prices: { monthly: 12.99, yearly: 124.99 },
    limits: { nodes: 10, users: 10, ...unlimited, installations: 1 },
    allSignIn: true,
    trialDays: TRIAL_DAYS,
  },
  {
    id: 'colony',
    name: 'Colony',
    tagline: 'Larger teams and clusters.',
    prices: { monthly: 24.99, yearly: 239.99 },
    limits: { nodes: 25, users: 30, ...unlimited, installations: 1 },
    allSignIn: true,
  },
  {
    id: 'apiary',
    name: 'Apiary',
    tagline: 'Many nodes or users, or several installations.',
    prices: null,
    limits: {
      nodes: 'per-key',
      users: 'per-key',
      ...unlimited,
      installations: 'per-key',
    },
    allSignIn: true,
  },
];

export function getPlan(id: PlanId): Plan {
  const plan = plans.find((p) => p.id === id);
  if (!plan) throw new Error(`No plan ${id}`);
  return plan;
}

/** The plans bought through the checkout. */
export const paidPlans = plans.filter((p) => p.prices !== null);

/** The lowest monthly price, for "from $4.99 a month". */
export const lowestMonthly = Math.min(
  ...paidPlans.map((p) => p.prices?.monthly ?? Infinity)
);

/** The portal's pricing page: it asks for the installation ID. */
export const subscribeUrl = (period: Period) =>
  `${PORTAL_URL}/pricing?period=${period}`;

/** The portal's trial page: it asks for the installation ID too. */
export const TRIAL_URL = `${PORTAL_URL}/trial`;

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** $4.99 */
export const formatUsd = (amount: number) => usd.format(amount);

/** What a yearly price comes to per month, to the cent. */
export const perMonth = (yearly: number) =>
  Math.round((yearly * 100) / 12) / 100;

/** "20 apps", "Unlimited apps", "Set per key"; one/many by the count. */
export function formatLimit(limit: Limit, one: string, many: string): string {
  if (limit === 'none') return `Unlimited ${many}`;
  if (limit === 'per-key') return `${capitalize(many)} set per key`;
  return `${limit} ${limit === 1 ? one : many}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
