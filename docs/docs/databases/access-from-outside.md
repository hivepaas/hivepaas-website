---
sidebar_position: 2
description: 'Reaching a database from outside the cluster: a desktop client, a BI tool, an app hosted elsewhere.'
---

# Access from outside

A database is private to its environment. Expose it only when something outside
the cluster must reach it, such as a desktop client, a BI tool, or an app hosted
elsewhere, and take it off the internet again when that is over.

## How it works

The database gets a **TCP** domain, such as `db.example.com`. Traefik opens the
database's port, such as `5432`, on every node. A client connects there with
TLS and names the domain in its TLS handshake (SNI), and Traefik sends it to the
database that has that domain. Several databases can share one port, each with
its own domain.

Traefik only routes connections that start TLS. A client that connects without
it is not let through.

The TLS is handled in one of two ways:

|                              | Traefik ends TLS                                  | TLS passthrough                                   |
| ---------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| The certificate              | The domain's, obtained and renewed by HivePaaS    | Mounted into the database, which serves it itself |
| What the database needs      | Nothing                                           | Its own TLS turned on                             |
| From Traefik to the database | Unencrypted, on the environment's private network | Encrypted from the client all the way             |

Traefik ending TLS is the simpler one, and enough for most. Use passthrough when
the connection must stay encrypted all the way to the database.

## Which databases

| Database               | Traefik ends TLS                  | TLS passthrough                                                     |
| ---------------------- | --------------------------------- | ------------------------------------------------------------------- |
| **PostgreSQL**         | Yes, any version                  | Yes; a client that starts TLS directly needs PostgreSQL 17 or later |
| **MongoDB**            | Yes                               | Yes, with TLS turned on in `mongod`                                 |
| **Redis**, **Valkey**  | Yes, from a client that sends SNI | Yes, with TLS turned on in the server                               |
| **MySQL**, **MariaDB** | No                                | No: [publish its port](#mysql-and-mariadb) instead                  |

A database with an HTTP interface, such as ClickHouse's on `8123`, CouchDB or
Elasticsearch, needs none of this: give that port an ordinary HTTP domain, as
for any app. See [App domains](../domains-and-tls/app-domains.md).

## Expose it, Traefik ending TLS

1. Point the domain's DNS at your servers, such as `db.example.com`. A wildcard
   record for your root domain already covers it.
2. In the database's **Routing Settings**, turn on **Expose The App To The
   Internet**, and add the domain with:
   - **Protocol** set to **TCP**;
   - **Container Port** set to the database's port, such as `5432`;
   - its **SSL Certificate**, or none, for HivePaaS to find or get one.
3. Save.
4. Open the port in your firewall.

The database's **App Kind** shows the same certificate, and **TLS Passthrough**,
turned off.

Then connect with TLS, to the domain:

```bash
# PostgreSQL: libpq sends SNI from version 14
psql "host=db.example.com port=5432 dbname=app user=app sslmode=verify-full sslrootcert=system"

# MongoDB
mongosh "mongodb://app:<password>@db.example.com:27017/app?tls=true&authSource=admin"

# Redis and Valkey: redis-cli sends SNI only when asked
redis-cli -h cache.example.com -p 6379 --tls --sni cache.example.com -a '<password>'
```

A client that sends no SNI reaches Traefik, but not the database: a Redis client
then fails with an error such as `Unknown RESP type 72 "H"`, Traefik's HTTP
answer. `redis-cli` and `valkey-cli` send it with `--sni`, and ioredis with
`tls: { servername: "cache.example.com" }`, even for a `rediss://` URL.

With Traefik ending TLS, the database itself has no TLS: leave its
[SSL mode](./ssl-mode.md) at **Disable**, for the apps beside it.

## Expose it, with TLS passthrough

The database serves the certificate itself, so it needs it as files, and its
TLS turned on.

1. Add the domain as above, then turn on **TLS Passthrough** on it, in its
   **Routing Settings** or in the database's **App Kind**.
2. Put the certificate and its key into the database's containers with a
   [setting mount](../configuring-apps/config-files.md#setting-mounts): mount
   the domain's SSL certificate, its certificate at `/tls/tls.crt` and its key
   at `/tls/tls.key`.
3. Turn TLS on in the database, reading those files.

For PostgreSQL, the key must belong to the `postgres` user, and be readable by
it alone: in the setting mount, give the key the owner `70` for the Alpine
images, or `999` for the Debian ones, and the mode `0600`. Then set the
database's **Command**, under **Deployment Settings**, to:

```bash
postgres -c ssl=on -c ssl_cert_file=/tls/tls.crt -c ssl_key_file=/tls/tls.key
```

The mounted files follow the certificate when it is renewed, but the database
reads them when it starts: restart it after a renewal.

With its own TLS on, the database can ask the apps beside it for TLS too: set
its [SSL mode](./ssl-mode.md) to **Require**.

## MySQL and MariaDB

A MySQL or MariaDB server speaks first, before any TLS, so Traefik can neither
read a domain from the connection nor pass it on. Publish the database's port
instead, in its **Networks**, such as `3306`. It is then on every node, for one
database per port, and open to whoever reaches the nodes.

The connection is then as encrypted as the server makes it. MySQL 8.4, and
MariaDB from 11.4, turn TLS on by themselves, with a certificate they sign:
have the client require it.

```bash
mysql -h <node address> -P 3306 -u app -p --ssl-mode=REQUIRED
```

## Keep it safe

A database on the internet is found and tried within hours.

- Give it a long, generated password, and connect as its ordinary user, not as
  `postgres` or `root`.
- Let through only the addresses that need it, in your firewall: the domain's
  allowed IPs and rate limits apply to HTTP only.
- Turn **Expose The App To The Internet** off when it is not needed.
