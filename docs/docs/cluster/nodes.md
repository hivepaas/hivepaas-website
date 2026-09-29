---
sidebar_position: 1
description: 'The servers in the cluster: adding them, their roles, and taking them out.'
---

# Nodes

HivePaaS runs on a Docker Swarm, and each server in it is a **node**. The server
HivePaaS was installed on is the first one, a manager. More servers join as
workers, to run more apps.

## Before a server joins

The new server needs:

- **Docker 29.5 or newer**, as the first server;
- **these ports open between every node of the cluster**:

| Port                   | For                                         |
| ---------------------- | ------------------------------------------- |
| `2377/tcp`             | the swarm's management, to the managers     |
| `7946/tcp`, `7946/udp` | nodes finding each other                    |
| `4789/udp`             | the overlay networks' traffic between nodes |

Keep these ports closed to the internet.

## Add a node

1. In **Cluster → Nodes**, click to join a new node, and copy the command it
   shows: `docker swarm join --token … <manager address>:2377`.
2. Run it on the new server, as root.

The server joins as a worker. HivePaaS starts its agent on it on its own, and
the node shows in **Cluster → Nodes**.

:::tip[More than one node]

- An image HivePaaS builds stays on the node that built it: turn on the
  [registry](../administration/system-settings.md#registry), so every node can
  run it.
- An app's storage is on the node its volume is on, and the app runs there: see
  [Volumes](./volumes.md).

:::

## Managers

Managers run the swarm: they keep its state, and decide where apps run. A
cluster keeps working while most of its managers are up, so:

- **1 manager** survives no loss of a manager;
- **3 managers** survive the loss of 1;
- **5 managers** survive the loss of 2.

An even number adds nothing: 4 managers survive the loss of 1, like 3. Use 1, 3
or 5.

**Set manager nodes**, in **Cluster → Nodes**, chooses which nodes are managers:
HivePaaS promotes and demotes them one at a time, in an order that keeps the
swarm running.

## A node's settings

Click a node to see its role, state, platform, Docker version and resources,
and to change:

- its **Name**;
- its **Labels**, such as `disk=ssd` or `zone=eu-1`: rules decide which apps
  run on which nodes by them;
- its **Availability**:
  - **Active**: runs apps;
  - **Pause**: keeps the apps it runs, takes no new ones;
  - **Drain**: moves its apps to other nodes, such as before maintenance.

## Remove a node

1. Set its **Availability** to **Drain**, and wait for its apps to move.
2. On the node, run `docker swarm leave`.
3. In **Cluster → Nodes**, delete it.

A manager is demoted first, with **Set manager nodes**.
