---
sidebar_position: 2
description: 'Passwords, two-factor authentication and single sign-on.'
---

# Sign-in and security

## Passwords

Wrong passwords are counted for each account, wherever they come from. After 10
in a row, the account waits 4 minutes before the next try, and each further 10
doubles the wait. A right password clears the count.

A user who forgot their password asks for a reset link on the sign-in page. It
is emailed to them, so HivePaaS needs an email account to send it: see
[Channels](../notifications/channels.md).

## Two-factor authentication

With two-factor authentication, a user signs in with their password and a
6-digit code from an authenticator app, such as Google Authenticator, 1Password
or Authy.

To set it up, a user scans a QR code with the app, and enters the code it shows.
An admin can require it of a user by setting their **Security Option** to
**Password 2FA**: they set it up on their next sign-in.

:::tip

The installer's `admin` signs in with a password alone. Turn on two-factor
authentication for it first: the dashboard reminds you until you do.

:::

## Single sign-on

Users can sign in with an account they already have: GitHub, GitLab, Gitea,
Google, Microsoft, or any OpenID Connect provider, such as Keycloak, Authentik
or Okta.

Google, Microsoft and OpenID Connect take a paid plan. On Bee, the free plan,
one cannot be added or enabled; one set up before keeps signing people in, and
**Integrations → OAuth** marks it **Kept on Bee**. See
[Sign-in providers on Bee](../plans-and-licenses/plans-and-limits.md#sign-in-providers-on-bee).

### Add a provider

1. In **Integrations → OAuth**, create one. Choose the **Provider**.
2. HivePaaS shows its callback URL, such as
   `https://hivepaas.example.com/api/auth/sso/callback/<id>`. Register an
   application with the provider, with that URL.
3. Copy the application's **Client ID** and **Client Secret** back. For OpenID
   Connect, give the provider's **Auto-Discovery URL** too, such as
   `https://sso.example.com/realms/acme/.well-known/openid-configuration`.
4. For a GitLab or Gitea of your own, give its **Auth URL**, **Token URL** and
   **Profile URL**, all three, such as `https://git.example.com/oauth/authorize`,
   `https://git.example.com/oauth/token` and
   `https://git.example.com/api/v4/user` for GitLab, or
   `https://git.example.com/login/oauth/authorize`,
   `https://git.example.com/login/oauth/access_token` and
   `https://git.example.com/api/v1/user` for Gitea. Leave them empty for
   gitlab.com or gitea.com.

The sign-in page then offers the provider.

A GitHub App that signs people in needs the **Email addresses** account
permission, read-only: without it, GitHub does not tell HivePaaS the email of
somebody who keeps theirs private.

### Who can sign in

Single sign-on signs in users HivePaaS already has, by email: invite a user
first. An invited user who signs in with the provider the first time is active
from then on.

The email has to be one the provider vouches for: one the person proved they
hold. An email that is only typed into a profile would let whoever typed it sign
in as the user who has it. So each provider's email is checked its own way:

| Provider       | The email signed in with                                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub         | The public email, which GitHub lets be only a verified one, or else the primary email, once it is verified.                                                       |
| GitLab         | The primary email, once it is confirmed.                                                                                                                          |
| Gitea          | The primary email, when it is among the account's verified emails.                                                                                                |
| Google         | The account's email, when Google says it is verified.                                                                                                             |
| Microsoft      | The user principal name, which is in a domain the organization proved it owns; the mail address only in that same domain. A guest of the organization is refused. |
| OpenID Connect | The email, when the provider says `email_verified`.                                                                                                               |

An OpenID Connect provider whose users and emails you manage yourself, such as
your own Keycloak, may not say `email_verified` for every user. Turn on **Trust
emails** in its setting to take every email it gives as verified. Never turn it
on for a provider anybody can sign up to.

A sign-in that fails comes back to the sign-in page, which says why: an email
the provider does not vouch for, or one no user has.

An admin can require a user to sign in with single sign-on only, with the
**Enforce SSO** security option.

## HivePaaS's own security

In **System → HivePaaS → Security**, an admin decides:

| Setting                    | What it does                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Return Secrets via API** | Lets the API and the dashboard show secrets' values, to users who may reveal them. Off by default.                 |
| **Privileged Apps**        | Lets apps mount the node's Docker socket or a host directory, which makes them root on their node. Off by default. |
| **Change App Secret**      | Changes the key that protects every stored secret.                                                                 |

After changing the app secret, back up the new `hivepaas.toml`, in the app data
directory: the old copy no longer opens anything.
