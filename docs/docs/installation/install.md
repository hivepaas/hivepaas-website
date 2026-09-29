---
sidebar_position: 2
description: "Installing HivePaaS on your first server, answering the installer's questions."
---

# Install HivePaaS

The installer sets up everything on one server: Docker when it is missing, a
single-node swarm, and HivePaaS itself. It asks for a few settings as it goes.

Check the [requirements](./requirements.md) first. To install without
questions, such as from a script, see [Silent install](./silent-install.md).

## Run the installer

On the server:

```bash
curl -fsSL https://raw.githubusercontent.com/hivepaas/hivepaas/release/deployment/release/install.sh | sudo bash
```

## Answer its questions

| Question                   | What to give                                                                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Admin email**            | The email of the first user, the admin.                                                                                                        |
| **Admin password**         | 10 characters or more, typed twice.                                                                                                            |
| **App domain**             | The dashboard's domain, such as `hivepaas.example.com`.                                                                                        |
| **Root domain**            | The domain your apps get subdomains of: the app domain, or a domain it is under. Enter keeps the one suggested, such as `example.com`.         |
| **App data directory**     | Where HivePaaS keeps its data. Enter keeps `/var/lib/hivepaas`.                                                                                |
| **Project data directory** | Where your projects' data goes. Enter keeps `project_data` in the app data directory.                                                          |
| **App secret**             | The key every stored secret is encrypted with. Enter generates one; give your own only to reuse one, with 32 characters or more and no spaces. |

When Docker is missing or too old, it asks first whether to install or upgrade
it.

Then it shows what it is about to do, and asks:

```text
Install HivePaaS with these settings? [Y/n]
```

## What it does

The installer goes through nine steps:

1. **Preflight**: checks the server, and installs `curl`, `openssl` and `jq` when missing.
2. **Docker**: installs or upgrades Docker when needed.
3. **Settings**: asks its questions, and checks that ports 80 and 443 are free.
4. **Host memory**:
   - adds a 2 GB swap file when the server has no swap;
   - sets `vm.swappiness` to 10;
   - installs [earlyoom](https://github.com/rfjakob/earlyoom), which stops the
     largest process, usually an app's, before the server runs out of memory. It
     leaves HivePaaS's own processes alone.
5. **Swarm**: makes the server a swarm manager, and creates the `hivepaas_net` network.
6. **Files**: creates the data directories, a self-signed certificate, and the files below.
7. **Deploy**: deploys the `hivepaas` stack: Traefik, PostgreSQL, Redis, and HivePaaS's app, worker, updater and agent.
8. **Waiting for HivePaaS**: waits, for up to 5 minutes, for the dashboard to answer.
9. **Finish**:
   - removes the admin's password from the server;
   - waits a few seconds for the dashboard's certificate from Let's Encrypt.

## When it is done

It prints where the dashboard is:

```text
  HivePaaS is running.

  Dashboard   https://hivepaas.example.com
  Sign in     as admin (you@example.com), with the password you chose.
```

- **Sign in** as `admin`, or with your email, and the password you chose.
- **Before DNS points at the server,** the dashboard answers at the server's IP
  address too, such as `https://203.0.113.10`.
- **The certificate:** HivePaaS asks Let's Encrypt for the dashboard's
  certificate as soon as the domain points at the server and port 80 is open.
  Until it arrives, the browser warns about a self-signed certificate. Once it
  has arrived, quit and reopen the browser: a browser keeps the first
  certificate it was shown.

After a restart, HivePaaS can take 30 to 60 seconds to answer.

## The files it leaves

In the app data directory, `/var/lib/hivepaas` by default:

| File              | Holds                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `hivepaas.toml`   | The app secret, the only key to your encrypted data.                                         |
| `credentials.txt` | The passwords and tokens of HivePaaS's services: its database's, Redis's, its agents' token. |
| `install.log`     | What each run of the installer did.                                                          |

:::warning[Back up hivepaas.toml]

Keep a copy of `hivepaas.toml` somewhere other than the server. Without the
app secret in it, the secrets HivePaaS stores cannot be read, even from a backup.

:::

The admin's password is not kept anywhere. The other settings live in the
environment of HivePaaS's services: `docker service inspect hivepaas_app` shows
them.

## Running it again

Running the installer again is safe:

- **After an install that stopped**, it picks up where it stopped. Fix what it
  reported, and run it again.
- **On a server where HivePaaS runs**, it re-checks the server, and leaves
  HivePaaS as it is. It reads HivePaaS's settings back from its services, and
  never resets the swarm, removes a service or a volume, or makes a new secret.
- **With `--redeploy`**, it deploys HivePaaS's stack again, from its stack file.
  Changes HivePaaS made to its own services since - Traefik's settings, the
  dashboard's routing - go back to the stack file's.

```bash
curl -fsSL https://raw.githubusercontent.com/hivepaas/hivepaas/release/deployment/release/install.sh | sudo bash -s -- --redeploy
```

### A database from an earlier install

After `docker stack rm hivepaas`, the database of the earlier HivePaaS stays on
the server. The installer then asks what to do with it:

- **keep**: use it again. This needs its password, which it reads from
  `credentials.txt`, and the earlier `hivepaas.toml`.
- **reset**: delete everything in it, and install afresh.
