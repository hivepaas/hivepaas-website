---
sidebar_position: 3
description: 'Installing HivePaaS without questions, from a settings file.'
---

# Silent install

The installer can take every setting from a file and ask nothing, for a script,
a provisioning tool, or the next server.

## 1. Download the installer and the settings file

On the server:

```bash
curl -fsSL https://get.hivepaas.com -o install.sh
curl -fsSLO https://github.com/hivepaas/hivepaas/releases/download/v1.0.0-beta4/install.env
```

Both come with a release: `get.hivepaas.com` is the installer of the current
one, and `install.env` is attached to it, beside the installer. For another
release, take `install.env` from that release on the
[Releases](https://github.com/hivepaas/hivepaas/releases) page. The copies in
the repository are not the release's: the installer there deploys whatever
`main` holds.

## 2. Fill in the settings

`install.env` explains each setting. Three are required:

```bash title="install.env"
HIVEPAAS_ADMIN_EMAIL=you@example.com
HIVEPAAS_ADMIN_PASSWORD='a password of 10 characters or more'
HIVEPAAS_APP_DOMAIN=hivepaas.example.com
```

The file is `KEY=VALUE` lines, read as data and never run. Quote a value with
spaces. An empty value, or a line left commented out, takes the default.

## 3. Run it

```bash
sudo bash install.sh --config install.env --yes
```

`--yes` answers yes to installing Docker, or upgrading one that is too old,
and to the final confirmation. With every required setting given, nothing is
asked.

The installer then goes through the same steps as an
[install with questions](./install.md#what-it-does), and leaves the same files.

:::warning[Delete install.env]

The file holds the admin's password. Delete it once HivePaaS is installed.

:::

## All settings

| Setting                     | Default                              | What it is                                                                                                                                                         |
| --------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `HIVEPAAS_ADMIN_EMAIL`      | required                             | The admin's email.                                                                                                                                                 |
| `HIVEPAAS_ADMIN_PASSWORD`   | required                             | The admin's password: 10 characters or more.                                                                                                                       |
| `HIVEPAAS_APP_DOMAIN`       | required                             | The dashboard's domain, such as `hivepaas.example.com`.                                                                                                            |
| `HIVEPAAS_ROOT_DOMAIN`      | the app domain's last two labels     | The domain apps get subdomains of: the app domain or a domain it is under. `example.com` for `hivepaas.example.com`, and three labels under a suffix like `co.uk`. |
| `HIVEPAAS_APP_SECRET`       | generated                            | The key every stored secret is encrypted with: 32 characters or more, no spaces, quotes or backslashes.                                                            |
| `HIVEPAAS_DATA_DIR`         | `/var/lib/hivepaas`                  | Where HivePaaS keeps its data.                                                                                                                                     |
| `HIVEPAAS_PROJECT_DATA_DIR` | `project_data` in the data directory | Where projects' data goes.                                                                                                                                         |
| `HIVEPAAS_TIMEZONE`         | the server's, or `UTC`               | The timezone scheduled jobs' hours are read in, a zone name such as `America/New_York`.                                                                            |
| `HIVEPAAS_CHANNEL`          | `beta`                               | The release channel: `beta` or `stable`.                                                                                                                           |
| `HIVEPAAS_SWAP`             | `true`                               | `false` adds no swap file to a server without swap.                                                                                                                |
| `HIVEPAAS_SWAP_SIZE_MB`     | `2048`                               | The swap file's size, in MB.                                                                                                                                       |
| `HIVEPAAS_EARLYOOM`         | `true`                               | `false` does not install earlyoom.                                                                                                                                 |
| `HIVEPAAS_UPGRADE_DOCKER`   | not upgraded                         | `true` upgrades a Docker that is new enough but not the latest. `--yes` alone does not.                                                                            |
| `HIVEPAAS_EXISTING_DB`      | none: the install stops              | `keep` or `reset`, for [a database left by an earlier install](./install.md#a-database-from-an-earlier-install). `--yes` does not answer it.                       |
| `HIVEPAAS_DB_PASSWORD`      | from `credentials.txt`               | With `keep`: the earlier database's password, when `credentials.txt` is gone.                                                                                      |

## Settings from the environment

The settings can also come from the environment, which wins over the file:

```bash
sudo HIVEPAAS_CHANNEL=stable bash install.sh --config install.env --yes
```

## When a setting is missing

With no terminal to ask on, a missing required setting stops the install before
anything changes, and the installer names what is missing. Add it to the file,
and run it again.
