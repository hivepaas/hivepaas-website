---
sidebar_position: 3
description: 'What SSL mode the apps beside a database connect with, and what to set in clients outside.'
---

# SSL mode

A database's **SSL Mode**, in its **App Kind**, is how the apps of its
environment are to connect to it: whether they use TLS, and how far they check
the database's certificate. It is not a setting of the database itself: the
database does TLS or not, depending on how it is set up.

The database shares it as `HIVEPAAS_SSL_MODE`. For PostgreSQL, **Link to another
app** writes it into the variables it suggests: `sslmode=` in `DATABASE_URL`,
`DB_SSL_MODE`, and `PGSSLMODE`.

## The modes

They are PostgreSQL's, which most PostgreSQL drivers understand:

| Mode            | The client                                                             |
| --------------- | ---------------------------------------------------------------------- |
| **Disable**     | Never uses TLS.                                                        |
| **Prefer**      | Uses TLS if the database offers it, and connects without it otherwise. |
| **Require**     | Uses TLS, or does not connect. It does not check the certificate.      |
| **Verify CA**   | Also checks that the certificate is signed by an authority it trusts.  |
| **Verify Full** | Also checks that the certificate is for the host name it connects to.  |

## Which one to choose

The apps of the environment reach the database on their private network,
straight, and never through Traefik: what counts is whether the database itself
does TLS.

| The database                                                                                                                     | SSL mode    |
| -------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Has no TLS of its own: as deployed from the app store, and when [Traefik ends TLS](./access-from-outside.md) for clients outside | **Disable** |
| Has its own TLS turned on, such as for [TLS passthrough](./access-from-outside.md#expose-it-with-tls-passthrough)                | **Require** |

Left unset, it is **Disable**.

**Verify CA** and **Verify Full** rarely fit here. The apps reach the database by
its key, such as `db`, which is not the name its certificate is for, and they
need the authority's certificate, mounted into each of them.

Changing it reaches the apps that refer to it on their next deployment.

## Clients outside

A client outside the cluster connects through its domain, and chooses its own
mode:

- **Verify Full** checks the certificate the domain serves, which comes from a
  public authority, such as Let's Encrypt. libpq looks for the authority in
  `~/.postgresql/root.crt`: give it `sslrootcert=system`, from libpq 16, to use
  the system's authorities instead.

  ```bash
  psql "host=db.example.com dbname=app user=app sslmode=verify-full sslrootcert=system"
  ```

- **Require** encrypts, without checking whom it talks to.
- **Disable** is not let through: Traefik only routes connections that start
  TLS.

The other databases name it their own way:

| Database       | Require                                     | Check the certificate         |
| -------------- | ------------------------------------------- | ----------------------------- |
| MySQL, MariaDB | `--ssl-mode=REQUIRED`                       | `--ssl-mode=VERIFY_IDENTITY`  |
| MongoDB        | `tls=true&tlsAllowInvalidCertificates=true` | `tls=true`                    |
| Redis, Valkey  | `--tls --insecure`                          | `--tls`, and `rediss://` URLs |
