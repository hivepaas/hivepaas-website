---
sidebar_position: 3
description: 'Connecting a DNS provider, for wildcard certificates.'
---

# DNS providers

With access to your DNS, HivePaaS proves to the certificate authority that a
domain is yours by writing a DNS record, the DNS-01 challenge. That gets:

- **wildcard certificates**, such as `*.example.com`: one certificate for every
  app under a domain, where HTTP gets one per app;
- **certificates before DNS points at your servers**, or for servers the
  internet cannot reach on port 80.

## Supported providers

Cloudflare, AWS Route 53, Google Cloud DNS, Azure DNS, DigitalOcean, Hetzner,
GoDaddy, Namecheap, Baidu Cloud, Huawei Cloud, Tencent Cloud,
acme-dns, and any DNS server that takes RFC 2136 updates, such as BIND or
PowerDNS.

## Add a provider

1. In **Integrations → ACME DNS Providers**, create one.
2. Choose the **Provider**, and give its credentials, such as an **API Token**
   for Cloudflare.
3. Under **Your Domain**, give a domain it manages, and click **Test DNS
   Access**: HivePaaS checks that the credentials can read the zone and write
   its records.

Give the credentials no more access than they need. For Cloudflare, an API token
with **Zone:Read** and **DNS:Edit** on the zone.

For the certificates it gets on its own, HivePaaS uses a DNS provider the
project can see. Keep to one provider for them: with several, it may pick one
that does not manage the domain. For the domains of another provider, create
their certificates yourself, choosing it.

A provider made globally, and **Available in Projects**, serves every project.

## RFC 2136

For a DNS server of your own, give:

- **Nameserver**, the server to send updates to, such as `ns1.example.com:53`;
- **Tsig Key Name**, **Tsig Algorithm** and **Tsig Secret**, of a TSIG key the
  server accepts updates with.

## A certificate from a provider

A certificate you create yourself, in **Integrations → SSL Certificates**, uses
a provider when you choose it under **ACME DNS Provider**. See
[Custom certificates](./custom-certificates.md).
