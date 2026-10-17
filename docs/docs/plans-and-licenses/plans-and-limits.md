---
sidebar_position: 1
description: 'The plans, what counts towards each limit, where it is checked, and the sign-in providers Bee has.'
---

# Plans and limits

## The plans

|                           | **Bee**                           | **Comb** | **Hive**         | **Colony** | **Apiary**  |
| ------------------------- | --------------------------------- | -------- | ---------------- | ---------- | ----------- |
| **Monthly**               | free                              | $4.99    | $12.99           | $24.99     | quoted      |
| **Yearly**                | -                                 | $47.99   | $124.99          | $239.99    | quoted      |
| **Nodes**                 | 2                                 | 5        | 10               | 25         | set per key |
| **Users**                 | 2                                 | 5        | 10               | 30         | set per key |
| **Apps**                  | 20                                | no limit | no limit         | no limit   | no limit    |
| **Functions**             | 20                                | no limit | no limit         | no limit   | no limit    |
| **Previews at a time**    | 2                                 | no limit | no limit         | no limit   | no limit    |
| **Sign-in providers**     | GitHub, GitHub App, GitLab, Gitea | all      | all              | all        | all         |
| **Installations per key** | 1                                 | 1        | 1                | 1          | set per key |
| **Trial**                 | -                                 | -        | 14 days, no card | -          | -           |

**Bee** is what an installation runs without a key, for as long as you like. It
is also what it runs on when its key is not in force: run out, for another
installation, or one that cannot be verified.

Prices are in US dollars, before tax. A yearly price is 20% off twelve monthly
ones. The license portal shows them in your currency, and the checkout works
out the tax where you are: [Paddle](./buying-and-billing.md#paddle-the-merchant-of-record),
the merchant of record, charges it. See [the pricing page](https://hivepaas.com/pricing).

**Apiary** is for many nodes or users, several installations under one key,
invoices instead of a card, and support terms. It is quoted: ask through
**Contact us** on the [pricing page](https://hivepaas.com/pricing). Its keys are
issued by hand, outside the checkout.

## What counts

Each count is of the whole installation, and is read when something is created.
**System → License → Usage** shows each of them, against the plan's limit.

### Apps

Every app of your projects, except:

- a function, which counts as a [function](#functions);
- a [pull request preview](../deploying-apps/pr-previews.md), which counts as a
  [preview](#previews-at-a-time);
- an app that belongs to another: the database apps cloned for a preview, and
  the apps a template creates beside the one you named, such as its database or
  its other services. A template from the [app store](../deploying-apps/app-store.md)
  counts as one app, whatever it creates with it;
- HivePaaS's own apps, which it runs in a project of its own.

A deleted app, and the apps of a deleted project, do not count. Each service of
a [Docker Compose file](../deploying-apps/docker-compose.md) becomes an app, and
each counts.

### Functions

Every [function](../deploying-apps/functions.md), with the same exceptions as
apps. An app never becomes a function, nor a function an app, so a function
counts from when it is created, imported or cloned.

### Users

Users who are active, and users invited who have not signed up yet: an
invitation holds a seat. Disabled users do not count. Inviting someone again
who is still pending takes no second seat.

### Nodes

Every node of the swarm, whatever its state or availability. Removing a node
from the swarm frees its place; draining or pausing it does not.

### Previews at a time

The [pull request previews](../deploying-apps/pr-previews.md) that exist now.
The database apps cloned for a preview are part of it, and do not count. A
preview removed, as when its pull request closes, frees its place.

### Sign-in providers

Not a count: Bee has some sign-in providers, and every paid plan has them all.
See [Sign-in providers on Bee](#sign-in-providers-on-bee).

## Where each limit is checked

| Limit                  | Checked when                                                                                                                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Apps**               | an app is created: on its own, from the app store, by a [clone](../configuring-apps/cloning.md), by an [import](../administration/export-and-import.md#import), or from a Docker Compose file |
| **Functions**          | a function is created, imported, or cloned with **Clone Deployment Configuration**                                                                                                            |
| **Users**              | a person is [invited](../administration/users-and-access.md#invite-a-user), or a disabled user is enabled again                                                                               |
| **Nodes**              | HivePaaS gives out the command to [join a node](../cluster/nodes.md#add-a-node), or joins a server itself                                                                                     |
| **Previews at a time** | a preview is created, by a comment on its pull request or from the dashboard                                                                                                                  |
| **Sign-in providers**  | a Google, Microsoft or OpenID Connect provider is created, enabled, or changed to one of those kinds; by an import too                                                                        |

A function cloned without **Clone Deployment Configuration** is left without its
kind: it is an app, and counts as one.

## A limit only stops creating

A limit is checked when something is created, and nowhere else. Nothing that
runs is stopped, scaled down or deleted because of one.

An installation can have more of a kind than its plan allows: after a key runs
out, after a downgrade, or when a server joins the swarm without HivePaaS. It
keeps everything. It can add nothing more of that kind until there are fewer
than the limit, or until a plan that allows more is in force. See
[Grace, expiry and limits](./grace-expiry-and-limits.md).

## Sign-in providers on Bee

Bee signs people in with their password, and with GitHub, the GitHub App,
GitLab and Gitea. Google, Microsoft and OpenID Connect providers, such as
Keycloak, Authentik or Okta, take a paid plan: on Bee, one cannot be created,
enabled, or changed to one of those kinds, in **Integrations → OAuth** or by an
import.

One that exists keeps signing people in on Bee: turning it off would lock out
the users who have no password. In **Integrations → OAuth**:

- **Kept on Bee** marks one that is enabled. It stays editable, so an expiring
  client secret can be replaced; but once disabled, it cannot be enabled again
  without a paid plan.
- **Unavailable on Bee** marks one that is disabled.

See [Single sign-on](../administration/sign-in.md#single-sign-on).
