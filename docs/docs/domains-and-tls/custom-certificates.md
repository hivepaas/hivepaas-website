---
sidebar_position: 4
description: 'Using a certificate you already have, or one you ask for yourself.'
---

# Custom certificates

HivePaaS gets most certificates on its own. Create one yourself to use a
certificate you bought, to ask for a wildcard up front, or to use another
authority for one domain.

## Upload a certificate

In **Integrations → SSL Certificates**, create a certificate with **Certificate
Type** set to **Custom**:

| Setting            | What to give                                                                 |
| ------------------ | ---------------------------------------------------------------------------- |
| **Domain**         | The name it is for, such as `shop.com`, or a wildcard, such as `*.shop.com`. |
| **Certificate**    | The certificate, in PEM.                                                     |
| **Private Key**    | Its private key, in PEM.                                                     |
| **CA Certificate** | The chain of the authority that issued it, if it has one.                    |
| **Expire At**      | When it expires.                                                             |
| **Notify From**    | When to start reminding you that it expires.                                 |

HivePaaS cannot renew a certificate you uploaded: upload the new one before the
old one expires.

## Ask an authority for one

Create a certificate with **Certificate Type** set to **Let's Encrypt**,
**ZeroSSL** or **Google Trust**, and give:

- **Domain**, such as `*.example.com`;
- **SSL Provider**, the authority's account, for ZeroSSL and Google Trust;
- **ACME DNS Provider**, for a wildcard: see [DNS providers](./dns-providers.md);
- **Key Type**, and **Auto-renew**.

HivePaaS obtains it, and renews it with the others.

A **Self-Signed** certificate is signed by HivePaaS itself: browsers warn about
it, but it serves internal names no authority would.

## Use it

A certificate serves every domain it covers, without anything more: HivePaaS
finds it when it looks for one. To choose it for a domain, pick it under the
domain's **SSL Certificate**, in the app's **Routing Settings**.

The same field has a quick way to create one, for the domain being edited, or
the wildcard above it.

## Where it is kept

A certificate made in the main **Integrations** serves every project when
**Available in Projects**; one made in a project's **Integrations** serves that
project's apps.
