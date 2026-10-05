---
sidebar_position: 1
description: 'The problems people run into most, and their fixes.'
---

# Common issues

The problems people run into most, and their fixes.

:::info[Being written]

This page is being written. It will cover:

- The dashboard cannot be reached
- A certificate is not issued
- A domain shows 404 or a bad gateway
- An app made from a template does not start

:::

## A network cannot start: "Pool overlaps"

Some apps never start, often the logging backend and its collector, and their
tasks are rejected with:

```text
invalid pool request: Pool overlaps with other one on this address space
```

Docker's own log, `journalctl -u docker`, repeats `Failed creating ingress
network` with the same words.

A swarm takes its networks' addresses from 10.0.0.0/8, a /24 each:
10.0.0.0/24 for its ingress network, 10.0.1.0/24 for the next, and so on.
Docker's own networks on the server, `docker0` and `docker_gwbridge`, take
theirs from `default-address-pools` in `/etc/docker/daemon.json`. When that
setting is also in 10.0.0.0/8, both hand out the same subnets in the same order,
and a swarm network given one that a network of Docker's own holds cannot be
created on the server. Check:

```bash
docker info --format '{{range .DefaultAddressPools}}{{.Base}} {{end}}'
docker network inspect bridge docker_gwbridge -f '{{.Name}} {{range .IPAM.Config}}{{.Subnet}}{{end}}'
```

To fix it, give Docker's own networks another range, and have Docker make them
again:

1. In `/etc/docker/daemon.json`, change the setting to a range your server's
   own networks do not use, or remove it to have Docker's defaults:

   ```json
   "default-address-pools": [{ "base": "172.16.0.0/12", "size": 20 }]
   ```

2. Reset Docker's own networks, on the server:

   ```bash
   sudo systemctl stop docker docker.socket
   sudo mv /var/lib/docker/network/files/local-kv.db /root/local-kv.db.bak
   sudo ip link delete docker0
   sudo ip link delete docker_gwbridge
   sudo systemctl start docker
   ```

Every container on the server restarts. The swarm, its services and its
networks are kept; networks made with `docker network create` on this server
alone are forgotten. Docker makes `docker0` and `docker_gwbridge` again from the
new range, and the swarm's networks start.
