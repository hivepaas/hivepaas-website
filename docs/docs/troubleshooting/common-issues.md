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

## A network that cannot start: "Pool overlaps"

Some apps never start, often the logging backend and its collector, and their
tasks are rejected with:

```text
invalid pool request: Pool overlaps with other one on this address space
```

Docker's own log, `journalctl -u docker`, repeats `Failed creating ingress
network` with the same words.

The server was in another swarm before HivePaaS, and Docker has not restarted
since it left it. Docker still holds that swarm's network addresses: a network
of the new swarm given one of them cannot be created on the server, while the
networks it already has keep working.

Restart Docker on the server:

```bash
sudo systemctl restart docker
```

Every container on the server restarts, for about half a minute. The swarm then
creates its networks again, and the apps start. The installer checks for this
when it starts the swarm, and stops with the same advice.
