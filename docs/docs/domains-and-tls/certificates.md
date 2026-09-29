---
sidebar_position: 2
description: 'Certificates for every domain, obtained and renewed on their own.'
---

# Certificates

HivePaaS serves every domain over HTTPS, with a certificate it gets from Let's
Encrypt, and renews before it expires. Most apps need nothing more.

## How a domain gets its certificate

When an app gets a domain, HivePaaS looks for a certificate that covers it: one
for the domain itself, or a wildcard for the domain above it. If none does, it
asks a certificate authority for one:

- **Without a DNS provider**, the authority checks the domain over HTTP, on port
  80: the domain must already point at your servers. The certificate is for
  that domain alone.
- **With a [DNS provider](./dns-providers.md)**, the authority checks a DNS
  record HivePaaS writes. HivePaaS then asks for a wildcard, such as
  `*.example.com`, which covers every other app under it too, and can be issued
  before the domain points anywhere.

Getting a certificate takes seconds over HTTP, and a few minutes over DNS.
Until it arrives, the domain answers with a self-signed certificate, which
browsers warn about. A browser that saw it keeps it until it is restarted.

Local names, such as `app.localhost` or `nas.local`, get no certificate from an
authority: it could never reach them.

## Settings

A project's **Domain Settings**, in its settings, say how its certificates are
obtained:

| Setting                        | What it does                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Automatic Certificates**     | Gets a certificate for each domain nothing covers. Turned off, a domain has one only once you add it. |
| **Default Cert Type**          | Let's Encrypt, ZeroSSL, Google Trust, or self-signed.                                                 |
| **Default Key Type**           | The kind of key, such as EC P-256, the default, or RSA 2048.                                          |
| **Default Registration Email** | The email the authority writes to about your certificates.                                            |

## Authorities

Let's Encrypt needs no account. ZeroSSL and Google Trust need one: create an
**SSL Provider** in **Integrations → SSL Providers**, with the account's email,
and the **EAB KID** and **EAB HMAC** the authority gives you.

## Renewal

A certificate with **Auto-renew** is renewed from 30 days before it expires, by
the certificate renewal job. Its schedule is in **Settings → SSL Renewal**, with
**Run Renewal Now** to renew what is due at once.

## When a certificate cannot be obtained

The certificate's page in **Integrations → SSL Certificates** shows why, in its
last error. The usual reasons:

- the domain does not point at your servers yet, or port 80 is closed, for the
  HTTP check;
- the DNS provider's credentials cannot write the zone, for the DNS check.

After a failure, HivePaaS waits 6 hours before asking again for the same
certificate. Authorities limit how often they issue: Let's Encrypt, to five
identical certificates a week, and a redeploy loop asking on every attempt would
lock the domain out for days.
