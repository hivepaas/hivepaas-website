---
sidebar_position: 2
description: 'Finding the installation ID, pasting a key into System → License, and why a key is refused.'
---

# Install a license key

A license key is a line of text from the license portal. It names the
installation it is for, and puts its plan in force there once it is pasted into
**System → License**.

## Find the installation ID

A key is for one installation, which it names by its ID: the ID of the
installation's Docker Swarm, 25 lowercase letters and digits.
**System → License → Installation** shows it, with a button to copy it. On a
manager node, Docker gives it too:

```bash
docker info -f '{{.Swarm.Cluster.ID}}'
```

The portal asks for it when you start a trial or buy a plan. The **Upgrade** and
**Start a 14-day trial** buttons in **System → License** open the portal with it
filled in.

A swarm made again, as in a disaster recovery, has a new ID: see
[Moving a license](./moving-a-license.md).

## Get a key

- [Start a trial](./trial.md): 14 days of Hive, without a card.
- [Buy a plan](./buying-and-billing.md).
- A renewal, a plan change or a move: the portal issues a new key for each.

The portal shows each key to copy, emails it, and keeps it under **Licenses**.

## Paste it

1. In **System → License**, under **Install a key**, paste the key into
   **License key**.
2. Click **Install key**.

HivePaaS checks the key there and then, offline: its signatures, against public
keys built into HivePaaS; the installation it names; and its dates. Nothing is
sent anywhere. A key wrapped over several lines, as an email client may do, is
the same key: whitespace in it is ignored.

Once it is in, the page shows the plan and its status, and a message says what
is in force, such as `License installed: Hive, until Nov 30, 2026`.

### Replacing a key

A key installed replaces the one before it, whatever its plan: a renewal, a plan
change, a higher plan or a lower one. While a key is in force - active, a
trial, in its grace period, or moved and still holding - HivePaaS asks first:
**Replace the license key?** Confirm with **Replace key**.

A key cannot be removed, only replaced. To go back, paste the earlier key again,
if it is still in force.

## When a key is refused

A key that could not be in force here is refused, with the reason beside the
box. The key installed before stays as it is.

| HivePaaS says                                                               | Why                                                                                  | What to do                                                                       |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `This license key could not be verified`, with what failed on the next line | Its signatures do not verify, or it is not a key: cut short when copied, or changed. | Copy it again, whole, from the email or the portal's **Licenses**.               |
| `This license key is for another installation. This installation's ID is …` | The key names another installation.                                                  | Check the ID. For a swarm made again, [move the license](./moving-a-license.md). |
| `This license key has expired`                                              | Its period and its grace are over.                                                   | Paste the newest key, from **Licenses**; or [renew](./buying-and-billing.md).    |

### Development keys

HivePaaS's source comes with development keys, so that its developers and its
tests can make license keys of their own. A key they signed is accepted only by
a HivePaaS running in development, with `HP_ENV=development`, where **System →
License** marks it **Development key**. Anywhere else it is refused:
`This license key could not be verified`, then
`signed by a development key, accepted only in development`.

A key from the license portal is never one.

## What System → License shows

- **Plan**: the plan in force and its status, who the key is licensed to, its
  license ID and dates, and the portal's pages: **Upgrade**, **Start a 14-day
  trial** while no key has been installed, and **Your licenses**.
- **Usage**: how many there are of each kind the plan limits, against the
  limit. See [What counts](./plans-and-limits.md#what-counts).
- **Installation**: the installation ID.
- **Install a key**.
- **Online renewal**: whether the daily check for a newer key is on, the last
  check, and **Check for a newer key**. See
  [Renewal and privacy](./renewal-and-privacy.md).

The status says what the key installed amounts to here, now:

| Status                         | Means                                                       | Plan in force                                      |
| ------------------------------ | ----------------------------------------------------------- | -------------------------------------------------- |
| **No license**                 | No key is installed.                                        | Bee                                                |
| **Active**                     | Within the period paid for.                                 | the key's                                          |
| **Trial**                      | A trial, within its 14 days.                                | Hive                                               |
| **Grace period**               | The period paid for has ended; the key holds for its grace. | the key's                                          |
| **Expired**                    | Its grace is over.                                          | Bee                                                |
| **Invalid key**                | The key installed cannot be verified.                       | Bee                                                |
| **Another installation's key** | The key names another installation.                         | Bee                                                |
| **Moved**                      | The portal moved the license to another installation.       | the key's, for the grace the move leaves; then Bee |

See [Grace, expiry and limits](./grace-expiry-and-limits.md).

## Keep a key private

A key carries, besides the plan and its limits, the name and the email address
of whoever it was issued to. HivePaaS keeps it in its database and never writes
it in a log; its API answers with the name, never the email. Do not post a key
where others can read it, such as in an issue or a chat.

## From the API or the CLI

| Endpoint                           | Does                                                                                                        | Needs, on the System module |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------- |
| `GET /api/system/license`          | [The license in force](/api/get-license): status, plan, dates, usage of each limit, and the installation ID | **Read**                    |
| `PUT /api/system/license`          | [Installs a key](/api/update-license), given as `{"key": "..."}`                                            | **Write**                   |
| `POST /api/system/license/refresh` | [Asks the portal for a newer key](/api/refresh-license) now                                                 | **Write**                   |

A refused key is answered `412`, with the code `ERR_LICENSE_INVALID`,
`ERR_LICENSE_OTHER_INSTALLATION` or `ERR_LICENSE_EXPIRED`.

With the [CLI](../cli/index.md), from a file holding the key:

```bash
jq -Rs '{key: .}' key.txt | hivepaas api PUT /system/license -d @-
hivepaas api GET /system/license
```
