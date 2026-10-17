---
sidebar_position: 5
description: 'How a renewed key reaches the installation, by email or online, exactly what online renewal sends, and turning it off.'
---

# Renewal and privacy

A key holds until the end of the period paid for. At each renewal, the portal
issues a new key for the next period. It reaches your installation by email, to
paste, or online, by itself.

## By email

At each renewal, once a month on a monthly plan and once a year on a yearly
one, the portal emails the new key, and keeps it under **Licenses**. Paste it
into **System → License** before the old one's grace runs out: see
[Install a license key](./install-a-license-key.md#paste-it).

An installation that never reaches the internet works this way, and needs
nothing more.

## Online

Once a key is installed, HivePaaS asks the license portal for a newer one every
day, at 03:30 in the installation's timezone, and whenever someone clicks
**Check for a newer key** in **System → License**. The portal answers:

| Answer      | HivePaaS                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| **newer**   | installs the key it sends: a renewal, a plan change, a paid key in place of a trial.                          |
| **moved**   | notes when the license was [moved to another installation](./moving-a-license.md#the-installation-it-leaves). |
| **current** | nothing: the key installed is the newest.                                                                     |

A newer key is checked as a pasted one is, and refused the same way: the portal
is trusted with which key is newest, never with whether a key is valid here.

A check that fails, such as when the portal cannot be reached, is tried once
more, then again the next day; the key installed holds meanwhile. **System →
License → Online renewal** shows the last check, what came of it, and its error.
Each daily check is also a task, with its log, in
[Operations → Tasks](../administration/tasks-and-audit-logs.md#tasks).

The installation needs to reach `portal.hivepaas.com` over HTTPS, port 443.

## Exactly what is sent

```http
POST https://portal.hivepaas.com/api/licenses/refresh
Content-Type: application/json
Accept: application/json
User-Agent: HivePaaS

{"key": "<the license key installed>", "installationId": "<the installation ID>"}
```

That is all. No usage, no counts, no names of projects, apps, users, domains or
nodes, no hostname, and no version: the user agent says `HivePaaS`, and nothing
more. The key is what proves the request: the portal answers only for a key it
issued, and only for the installation that key names. Like any server, the
portal sees the address the request comes from.

- **Nothing is sent without a key.** An installation on Bee with no key
  installed never contacts the portal.
- **Over HTTPS only, to the portal only.** HivePaaS follows no redirect, so the
  key goes nowhere else.
- **The buttons are links.** **Upgrade**, **Start a 14-day trial** and **Your
  licenses** open the portal in your browser, the first two with the
  installation ID in the address. HivePaaS itself sends nothing when they are
  clicked.

The portal's address is `https://portal.hivepaas.com`, which the
`HP_LICENSE_PORTAL_URL` setting changes; only testing needs to.

## What the portal keeps

**Of a refresh**, nothing but two counters, which limit how often it can be
asked: one for the request's address, kept for a minute, and one for the key,
by its hash, kept for a day. A refresh is not logged, and changes nothing in the
portal's database.

**Of your account**: your name and email address, your licenses, the
installations they are for, the keys issued and the moves made, and a copy of
your subscriptions as Paddle reports them. Your payment details are Paddle's:
the portal never sees them.

See the [privacy policy](https://hivepaas.com/privacy).

## What HivePaaS keeps

The key installed, in its database, and of the last check: when it was, what
came of it, and its error. HivePaaS never writes the key in a log, and its API
answers with the name the key was issued to, never the email. Installing a key
is recorded in the [audit log](../administration/tasks-and-audit-logs.md#audit-logs)
by its license ID, plan and end date, and so is a **Check for a newer key** that
changes it; a daily check writes the same in its task's log.

## Turn online renewal off

Off, the daily check asks nothing. **Check for a newer key** still asks, when
someone clicks it: renewed keys are pasted from their email, or fetched that
way. **System → License → Online renewal** shows **Daily check** as **Off**.

There are two ways. The first lasts.

### In hivepaas.toml

In the app data directory, `/var/lib/hivepaas` by default, `hivepaas.toml` has
a `[license]` section. Set:

```toml
[license]
refresh_disabled = true
```

An installation made before the section was added to the file has none: add
it, at the end. Leave the file's permissions as they are: HivePaaS refuses it
if anyone but root can read it.

HivePaaS reads the file when it starts: restart it in **System → HivePaaS →
Actions**, with **Main service** and **Worker service(s)**. The setting then
holds through updates, the installer's `--redeploy`, and an install over a kept
database. Set in the file, it wins over the environment variable below.

### With an environment variable

```bash
docker service update --env-add HP_LICENSE_REFRESH_DISABLED=true hivepaas_app
docker service update --env-add HP_LICENSE_REFRESH_DISABLED=true hivepaas_worker
```

Each service restarts with it. It holds until HivePaaS's stack is deployed again
from its file, as the installer's `--redeploy` does, which drops it: set it in
`hivepaas.toml` to keep it.
