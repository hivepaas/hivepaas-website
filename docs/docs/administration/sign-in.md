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

### Add a provider

1. In **Integrations → OAuth**, create one. Choose the **Provider**.
2. HivePaaS shows its callback URL, such as
   `https://hivepaas.example.com/api/auth/sso/callback/<id>`. Register an
   application with the provider, with that URL.
3. Copy the application's **Client ID** and **Client Secret** back. For OpenID
   Connect, give the provider's **Auto-Discovery URL** too, such as
   `https://sso.example.com/realms/acme/.well-known/openid-configuration`.

The sign-in page then offers the provider.

### Who can sign in

Single sign-on signs in users HivePaaS already has, by email: invite a user
first. An invited user who signs in with the provider the first time is active
from then on.

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
