---
sidebar_position: 1
description: 'Giving an app one or more domains, and routing requests to it.'
---

# App domains

Traefik, in front of every app, takes each request on ports 80 and 443, and
sends it to the app whose domain it asks for. An app can have several domains,
each with its own rules.

## Point DNS at your servers

A domain reaches an app once its DNS points at your servers:

- a wildcard record for your root domain, such as `*.example.com`, covers every
  app domain under it, such as `shop.example.com`, at once;
- a domain outside it, such as `shop.com`, needs its own record.

## Add a domain

In the app's **Routing Settings**:

1. Turn on **Expose The App To The Internet**.
2. Set the **Container Port**, the port the app listens on. **Check port
   availability** checks that something answers there.
3. Under **Domains**, add the domain, such as `shop.example.com`.
4. Save.

HivePaaS routes the domain to the app, and gets it a certificate: see
[Certificates](./certificates.md). Each domain belongs to one app at a time.

## A domain's settings

Click a domain to set it up:

| Setting             | What it does                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------- |
| **Enabled**         | Routes the domain, or leaves it set up but unused.                                       |
| **Protocol**        | **HTTP** for web traffic; **TCP** or **UDP** for other protocols, below.                 |
| **Container Port**  | Another port of the app for this domain, such as an admin interface on `8081`.           |
| **SSL Certificate** | The certificate to serve. Left empty, HivePaaS finds or gets one.                        |
| **Force HTTPS**     | Redirects `http://` requests to `https://`.                                              |
| **Redirect To**     | Sends every request to another domain, such as `www.shop.com` to `shop.com`.             |
| **TLS Passthrough** | Hands the encrypted traffic to the app untouched: the app serves the certificate itself. |

With **TLS Passthrough**, mount the domain's certificate and key into the app
with a [setting mount](../configuring-apps/config-files.md#setting-mounts).

## Rules for a domain

Add configurations to a domain to shape its traffic:

| Configuration                     | What it does                                                                                  |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| **Basic Auth**                    | Asks for a user and password, from a basic auth setting, before letting a request through.    |
| **Client Configuration**          | Limits request bodies' size, and lets through only **Allowed IPs**, such as `192.168.1.0/24`. |
| **Rate Limit Configuration**      | Limits requests: an **Average** per period, a **Burst**, and **Max In-Flight Requests**.      |
| **Header Configuration**          | Adds headers to requests and responses, or removes them.                                      |
| **Compression Configuration**     | Compresses responses.                                                                         |
| **Path Rewrite Configuration**    | Adds or strips a path prefix, or replaces the path, before the request reaches the app.       |
| **Circuit Breaker Configuration** | Stops sending requests to an app that is failing, such as when `NetworkErrorRatio() > 0.30`.  |
| **Websocket Configuration**       | Keeps WebSocket connections working.                                                          |
| **Load Balancing Configuration**  | How requests are spread over the app's replicas: round robin, or others.                      |

**Path Rewrite Configuration** replaces a path in one of two ways:

- **Replace Path** `/old`, **Replace Path With** `/new`: `/old` becomes `/new`,
  and what is under it too - `/old/page` becomes `/new/page`. The path is taken
  as written, dots and all; `/older` and the other paths are left alone.
- With **Is Regex**, **Replace Path** is a pattern, and **Replace Path With**
  may use its groups: `^/blog/([0-9]+)$` with `/posts/$1` turns `/blog/42` into
  `/posts/42`. Paths the pattern does not match are left alone.

Basic auth users are set up once, in **Integrations → Basic Auth**, globally or
in the project.

### Rules for some paths

A rate limit counts requests per client address. On the domain, it counts every
request a page makes - its scripts, stylesheets and images as well as its API
calls - so a limit low enough for an API turns away ordinary visitors there. Set
it generously, or put the tighter limit on a path. Behind a proxy such as
Cloudflare, it counts per visitor only once HivePaaS knows the proxy: see
[System settings](../administration/system-settings.md#hivepaas).

**Path Configuration** gives a part of the domain its own rules: `/api/admin`
behind basic auth, `/api` with a rate limit. A path matches by its **Match
Mode**: exactly, by prefix, or by regular expression.

## TCP and UDP

An app that speaks something other than HTTP, such as a database, can have a
**TCP** domain. Its clients connect with TLS to the domain on the app's
container port, such as `db.example.com:5432`: Traefik opens that port, and
routes by the domain the client names in its TLS handshake. Open the port in
your firewall too.

In the same handshake, a client may name the protocol it speaks (ALPN), and
some refuse to go on unless the server accepts it. A TCP domain accepts the
registered ones of the services usually behind it: PostgreSQL's (`postgresql`),
SQL Server's (`tds/8.0`), `mqtt`, `imap`, `pop3`, `managesieve`,
`xmpp-client`, `xmpp-server`, DNS over TLS' (`dot`), and HTTP's. A client that
names another fails with `no application protocol`: add it to the domain's
**Extra ALPN Protocols**, such as `x-amzn-mqtt-ca`. With **TLS Passthrough**,
the app answers the handshake itself, and the setting does not apply.

Traefik does not route **UDP**. Publish the app's port in its **Networks**
instead.

## Which domains a project may use

A project's **Domain Settings**, in its settings, can restrict its apps to
**Allowed Domains**, such as `*.shop.example.com`: a domain outside them is
refused.
