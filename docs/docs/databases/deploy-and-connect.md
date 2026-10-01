---
sidebar_position: 1
description: 'Running PostgreSQL, MySQL, Redis and other databases, and connecting apps to them.'
---

# Deploy and connect

Databases run as apps, like any other, in the environment of the apps that use
them. The app store has templates for them: PostgreSQL and its extensions
(PostGIS, pgvector, TimescaleDB), MySQL, MariaDB, MongoDB, Redis and Valkey,
ClickHouse, Kafka and RabbitMQ, and more.

## Deploy a database

1. In the project, click **New From Template**, and pick the database, such as
   **PostgreSQL**.
2. Choose its version, its **Target Environment**, and its parameters: the
   database's name, its user, and its password, which can be generated.
3. Click **Deploy Template**.

The database keeps its data on a volume, which outlives its containers.

An app from the app store that needs a database brings its own: deploying it
creates one with it.

## Run one from its image

A database from the app store is set up already. One you run from its image
yourself, such as `postgres:18` or `mysql:8.4`, reads its first user, password
and database from env vars:

1. In its **App Kind**, set its category to **Database**, its engine, and its
   credentials: the database's name, its user, its password, and for MySQL and
   MariaDB its root password.
2. In its **Env Variables**, click **Suggest Env**. The engine App Kind names is
   chosen; choose another if the image runs one.
3. Add the variables it suggests, then save.

For PostgreSQL, they are:

```bash
POSTGRES_DB=${HIVEPAAS_DATABASE_NAME}
POSTGRES_USER=${HIVEPAAS_USER}
POSTGRES_PASSWORD=${HIVEPAAS_PASSWORD}
```

Each refers to what App Kind publishes, so the credentials are kept there, and
the apps that link to the database are told the same ones.

Suggest Env knows the official images of PostgreSQL, MySQL, MariaDB, MongoDB,
ClickHouse and RabbitMQ. They read the variables only when they create their
data: on a database that has data already, change a password inside it.

Redis and Valkey read no variable for their password. For them, Suggest Env
gives a command to put in the app's **Deployment Settings**: it starts the
server with App Kind's password, memory limit, eviction and persistence.

## Connect an app to it

A database is not on the internet unless you
[expose it](./access-from-outside.md). The apps of its environment reach it on
their private network, by its key, and on its port: an app named `db` running
PostgreSQL is `db:5432`.

A database shares its connection details with the apps of its environment as
variables:

| Variable                 | Holds                         |
| ------------------------ | ----------------------------- |
| `HIVEPAAS_HOST`          | its key, a host name          |
| `HIVEPAAS_PORT`          | its port                      |
| `HIVEPAAS_DATABASE_NAME` | the database's name           |
| `HIVEPAAS_USER`          | the user                      |
| `HIVEPAAS_PASSWORD`      | the password                  |
| `HIVEPAAS_SSL_MODE`      | its [SSL mode](./ssl-mode.md) |

An app refers to them in its own env vars as `${<key>.<variable>}`:

```bash
DB_HOST=${db.HIVEPAAS_HOST}
DB_PASSWORD=${db.HIVEPAAS_PASSWORD}
DATABASE_URL=postgres://${db.HIVEPAAS_USER}:${db.HIVEPAAS_PASSWORD}@${db.HIVEPAAS_HOST}:${db.HIVEPAAS_PORT}/${db.HIVEPAAS_DATABASE_NAME}
```

The references are resolved when the app is deployed, so a changed password
reaches the app on its next deployment.

### Link to another app

In the app's **Env Variables**, **Link to another app** writes these for you:
choose the database, and it suggests the variables its engine's clients expect,
such as a `DATABASE_URL`, each one a reference.

## Back it up

A database's data is on a volume of its node. Back it up to S3-compatible
storage with [app backups](../backups/app-backups.md).
