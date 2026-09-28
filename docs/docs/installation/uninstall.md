---
sidebar_position: 7
description: 'Removing HivePaaS from your servers.'
---

# Uninstall

Removing HivePaaS takes four commands, run as root on the server.

:::danger[This deletes everything]

These steps delete HivePaaS, every app it deployed, and all their data. They
cannot be undone. Back up what you want to keep first.

:::

## Before you start

Find HivePaaS's data directories: they are deleted in step 2. While HivePaaS
still runs:

```bash
docker service inspect hivepaas_app \
  --format '{{range .Spec.TaskTemplate.ContainerSpec.Env}}{{println .}}{{end}}' | grep STORAGE
```

- `HP_STORAGE_HOST_DIR` is the app data directory, `/var/lib/hivepaas` by default.
- `HP_STORAGE_PROJECT_DATA_HOST_DIR` is the project data directory, `project_data`
  in the app data directory by default.

## 1. Remove the HivePaaS stack

```bash
docker stack rm hivepaas
```

This removes HivePaaS's services: Traefik, its database and Redis, and its app,
worker, updater and agent. Swarm takes a few seconds to stop their containers.

## 2. Delete HivePaaS's data

With the default data directory:

```bash
rm -rf /var/lib/hivepaas
```

With another one, delete that directory instead. When the project data directory
is outside the app data directory, delete it too.

## 3. Leave the swarm

```bash
docker swarm leave --force
```

On the swarm's last manager, this ends the swarm, and with it every app
HivePaaS deployed.

With more than one server, make each worker leave first, by running on it:

```bash
docker swarm leave
```

then run `docker swarm leave --force` on the manager.

## 4. Remove Docker's data

```bash
docker system prune --all --volumes --force
```

This deletes every stopped container, every image, network and volume no
container uses, and the build cache: the images your apps ran, and their volumes
and databases.

:::warning

This is not limited to HivePaaS. Anything else Docker kept on this server, and
not in use, goes too.

:::

## What else the installer set up

The installer also changed the server itself. These can stay, and removing them
is up to you:

- **Docker**, when it installed it.
- **A swap file**, `/swapfile`, with a line for it in `/etc/fstab`, when the
  server had no swap.
- **`vm.swappiness = 10`**, in `/etc/sysctl.d/99-hivepaas-memory.conf`.
- **earlyoom**, and its settings.
