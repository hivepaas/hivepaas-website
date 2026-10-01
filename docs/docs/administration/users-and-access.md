---
sidebar_position: 1
description: 'Inviting people, and deciding what they can do.'
---

# Users and access

## Invite a user

In **User Management → Users**, invite a user with their **Email**, their
**Role**, and what they may reach. HivePaaS makes an invite link: copy it and
send it, or have HivePaaS email it when an email account is set up.

The invited user opens the link, picks a username and a password, and is in.
Until then, they show as pending.

## Roles

- **Admin**: everything, including users and HivePaaS's own settings.
- **Member**: what they are given, and nothing else.

## What a member may reach

A member's access has three parts:

**Module Access**, for each part of HivePaaS: projects, settings, the cluster,
users, and the system. For each, what they may do: **Read**, **Write**,
**Execute** (such as deploying, or running a job) and **Delete**.

**Project Access**, for each project they may see, and within it, each of its
environments: a member given `production` of a project, and not `development`,
sees and changes that environment's apps only.

**Capabilities**, two powers given apart:

- **Reveal Secrets**: read secrets' values, and mount secrets into apps;
- **Create API keys**: make API keys for their account. Taking it away deletes
  the keys they have.

A user can grant only what they hold themselves.

## Access that ends

**Access Expiration** ends a user's access at a date: a contractor's, or a
temporary helper's.

## Security option

Each user's **Security Option** says how they sign in:

| Option            | The user signs in with                                                                 |
| ----------------- | -------------------------------------------------------------------------------------- |
| **Password Only** | a password.                                                                            |
| **Password 2FA**  | a password and a code from an authenticator app. They set it up on their next sign-in. |
| **Enforce SSO**   | your single sign-on provider only: their password stops working.                       |

See [Sign-in and security](./sign-in.md).

## Disable or remove a user

**Disable User** stops a user signing in, and keeps their account and what it
did. **Remove User** deletes the account.

A user who forgot their password can be given a reset link: **Reset Password**
makes one to send them.

## API keys

Each user makes their own API keys, in **Your Account → API Keys**, for scripts
and CI. A key has:

- a **name**;
- what it may do: a key can do less than its user, never more;
- its **capabilities**: of its user's, which the key may use - none, unless it
  is given them;
- an **expiry**, a year at most.

The one capability a key can be given is **Reveal secrets**: reading passwords,
private keys and other secrets in the clear, and mounting them into apps. Only a
user who holds it can give it. Leave it off for a key that does not need it, and
always for one given to an AI assistant: a key without it is refused every
secret, even an admin's key. A key made before keys had capabilities has none.

A key cannot make, change or delete keys.

Its secret is shown once, when it is made: HivePaaS keeps only a hash of it. See
[REST API](../integrations/rest-api.md).
