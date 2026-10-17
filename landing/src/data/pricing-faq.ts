// The pricing page's questions and answers: its FAQ section shows them, and
// the page's FAQPage structured data repeats them for search engines.
import type { FaqItem } from './faq';
import {
  GRACE_DAYS,
  MOVES_PER_YEAR,
  REFUND_DAYS,
  TRIAL_DAYS,
  getPlan,
} from './plans';
import { DOCS_PLANS_URL } from './site';

const bee = getPlan('bee');
const hive = getPlan('hive');

export const pricingFaq: FaqItem[] = [
  {
    question: 'What counts as an app, a node and a user?',
    answer: `An app is any app you deploy, from Git, an image, a template or a compose file. A pull request preview, the databases cloned for it, HivePaaS's own system apps and functions are not counted as apps; functions have a limit of their own. A node is every server in the swarm, whatever its state: removing one frees its place, draining it does not. A user is everyone active or invited, since an invitation holds a seat; a disabled user does not count.`,
  },
  {
    question: 'What happens when I reach a limit?',
    answer: `Only creating stops. On ${bee.name}, with ${bee.limits.apps} apps, creating another one is refused, with a prompt to upgrade, and everything you already have keeps running. An installation that is over a limit, such as one set up before plans existed, keeps everything it has and can add more of that kind once it is under the limit or licensed.`,
  },
  {
    question: 'What happens when a license expires or I cancel?',
    answer: `Nothing that runs is stopped, scaled down or deleted. A paid key keeps working for ${GRACE_DAYS} days after the period paid for, with a banner, and the installation then falls back to ${bee.name}'s limits, which only stop creating. A trial has no grace: it ends on day ${TRIAL_DAYS}.`,
  },
  {
    question: 'Does HivePaaS need the internet to check a key?',
    answer: `No. A license key is checked offline, against public keys built into HivePaaS, so it works on a server with no internet access. Each renewal emails you the new key to paste in. If the server can reach the internet, HivePaaS fetches renewed keys by itself: once a day it sends the key and the installation ID to portal.hivepaas.com, and nothing else. That check can be turned off.`,
    link: { href: DOCS_PLANS_URL, label: 'How renewal works' },
  },
  {
    question: 'Can I move a license to another server?',
    answer: `Yes. A key is for one installation, named by its ID, and rebuilding a swarm gives it a new one. Move the license to the new ID in the portal, up to ${MOVES_PER_YEAR} times in any 365 days. The key left on the old installation runs out on its own.`,
  },
  {
    question: 'Is the trial a subscription?',
    answer: `No. The ${TRIAL_DAYS}-day ${hive.name} trial needs no card and charges nothing; when it ends, the installation is on ${bee.name} again unless you buy a plan. Start it from System → License in HivePaaS, or on the portal with your installation ID. There is one trial per installation and one per account.`,
  },
  {
    question: 'Can I change plans or cancel?',
    answer: `Yes, from the portal at any time. An upgrade is charged now, for the rest of the period, and a downgrade bills from the next one; the new key comes at once. Cancelling stops the renewals, and the key works to the end of the period paid for.`,
  },
  {
    question: 'Can I get a refund?',
    answer: `Yes. Any payment is refunded in full on request within ${REFUND_DAYS} days. Paddle, our merchant of record, handles refunds: ask through paddle.net, with the email address you paid with. The license is then revoked: no new keys are issued for it, and the key you have runs out on its own.`,
    link: { href: '/refunds', label: 'Refund policy' },
  },
];
