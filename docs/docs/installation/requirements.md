---
sidebar_position: 1
description: 'What a server needs before HivePaaS goes on it.'
---

# Requirements

HivePaaS installs on one Linux server, which becomes the manager of a Docker
Swarm. More servers can join it later, as workers.

## The server

- **Linux, and root access**: the installer runs as root, with `sudo`.
- **A distribution the installer knows**:
  - Debian, Ubuntu, and their derivatives;
  - Fedora, RHEL, CentOS, Rocky Linux, AlmaLinux, Oracle Linux and Amazon Linux;
  - SLES and openSUSE;
  - Arch and Manjaro;
  - Alpine.
- **4 CPUs, 8 GB of memory and a 40 GB disk are recommended.** HivePaaS runs on
  less, with less room left for your apps: the installer warns and goes on.

A fresh server is best. The installer installs what is missing itself.

## Docker

HivePaaS needs **Docker 29.5 or newer**.

- **Docker is missing:** the installer offers to install it.
- **Docker is older than 29.5:** the installer offers to upgrade it. Upgrading
  restarts the containers already running.
- **The server is already in a swarm:** it must be a manager, not a worker.

## Network

- **Ports 80 and 443 must be free.** Traefik, the proxy in front of HivePaaS and
  your apps, takes them. The installer stops if something else, such as a web
  server, listens on either.
- **Ports 80 and 443 must be open to the internet.** Let's Encrypt reaches port
  80 to issue certificates.
- **The server must reach the internet**, to download Docker, HivePaaS's images
  and release files from GitHub, and its certificates from Let's Encrypt.

## Domains

HivePaaS needs a domain for its dashboard, such as `hivepaas.example.com`, and
gives your apps subdomains of a root domain, such as `example.com`.

Point these DNS records at the server's public IP address:

| Record                    | For           |
| ------------------------- | ------------- |
| `hivepaas.example.com`    | the dashboard |
| `*.example.com`, wildcard | your apps     |

The records can come after the install. Until then, the dashboard answers at
the server's IP address, with a self-signed certificate.

## Next

[Install HivePaaS](./install.md), answering the installer's questions, or
[install it silently](./silent-install.md), from a settings file.
