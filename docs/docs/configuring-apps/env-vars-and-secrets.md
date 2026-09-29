---
sidebar_position: 1
description: 'Configuration and secrets, at every scope.'
---

# Env vars and secrets

An app gets its configuration from env vars, and its passwords and keys from
secrets. Both are set in the app's configuration, or once for a whole project
or environment.

## Env vars

In the app's **Env Variables**, env vars come in three kinds:

| Kind                             | For                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Runtime Env Variables**        | The app's containers, while they run.                                                             |
| **Build Time Env Variables**     | The image's build, for an app built from a [Git repository](../deploying-apps/git-repository.md). |
| **Shared Runtime Env Variables** | The app's containers, and the other apps of its environment, which can refer to them.             |

A change takes effect on the app's next deployment. **Re-deploy** applies it
without changing anything else.

### From the project and the environment

Env vars that many apps need, such as a log level or a region, go in the
project's **Env Variables**: for the whole project, or for one environment.

An app gets them all, and shows them as **Inherited** on its own page. Where an
app sets a variable of the same name, its own value wins.

### Referring to other values

An env var's value can refer to other values:

| Reference           | Is                                                       |
| ------------------- | -------------------------------------------------------- |
| `${NAME}`           | another env var of the app                               |
| `${secrets.NAME}`   | a secret of the app                                      |
| `${<app key>.NAME}` | a shared variable of another app of the same environment |

```bash
LOG_PREFIX=${HIVEPAAS_APP_NAME}-worker
API_TOKEN=${secrets.API_TOKEN}
CACHE_URL=redis://${cache.HIVEPAAS_HOST}:${cache.HIVEPAAS_PORT}/0
```

References to other apps are the way to connect apps: they follow the other app
when it moves or changes, where a hard-coded address does not. **Link to another
app** writes them for you; see [Databases](../deploying-apps/databases.md#connect-an-app-to-it).

### Variables HivePaaS sets

HivePaaS gives every app variables of its own:

| Variable            | Holds                                                             |
| ------------------- | ----------------------------------------------------------------- |
| `HIVEPAAS_APP_NAME` | the app's name                                                    |
| `HIVEPAAS_APP_ID`   | the app's ID                                                      |
| `HIVEPAAS_ENV`      | its environment                                                   |
| `HIVEPAAS_HOST`     | its host name on its environment's network, its key               |
| `HIVEPAAS_PORT`     | its port                                                          |
| `HIVEPAAS_DOMAIN`   | its domain                                                        |
| `HIVEPAAS_APP_URL`  | where it answers from outside, such as `https://shop.example.com` |

A database also shares its name, user and password.

## Secrets

A secret is a value nobody should read in the dashboard: a password, an API
key, a private key. In the app's **Secrets**, create one with:

- **Name**, such as `STRIPE_KEY`;
- **Value Type**: **Text**, or **Binary** for a file, such as a keystore;
- **Value**, up to 500 KB;
- **Available in Previews**, for the app's
  [pull request previews](../deploying-apps/pr-previews.md) to get it too.

A secret reaches the app two ways:

- **as an env var**, from a reference: `STRIPE_KEY=${secrets.STRIPE_KEY}`. Only
  a secret of 10 KB or less can be referred to;
- **as a file**, through a [setting mount](./config-files.md#setting-mounts).

### Secrets and env vars

- **Secrets stay hidden.** Once saved, a secret's value is shown only to a user
  who may reveal secrets, with **Reveal Secret**.
- **Secrets are kept out of logs.** HivePaaS filters their values out of the
  logs it shows; env vars' values are not.

A project's **Secrets** serve all its apps, like its env vars.
