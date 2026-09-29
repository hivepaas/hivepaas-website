---
sidebar_position: 2
description: 'The overlay networks apps talk over.'
---

# Networks

Apps talk over Docker's overlay networks, which span every node of the cluster.

## The networks HivePaaS makes

- **`hivepaas_net`**, which Traefik reaches apps over: every app exposed to the
  internet is on it.
- **One private network for each environment** of each project: the apps of an
  environment reach each other there, by their keys, and nothing else reaches
  them.

These are made and removed with their environments: there is nothing to set up.

## Networks of your own

**Cluster → Networks** lists the cluster's networks. **Sync** brings in networks
made outside HivePaaS, with Docker.

To make one, such as for two apps of different environments to talk, create a
network:

| Setting                          | What it does                                                                   |
| -------------------------------- | ------------------------------------------------------------------------------ |
| **Name**                         | The network's name. In a project, it is prefixed with the project's.           |
| **Attachable**                   | Lets containers started on their own join it, beside apps.                     |
| **Internal**                     | Cuts it off from the outside: its apps reach each other, and not the internet. |
| **Enable IPv4**, **Enable IPv6** | The addresses it gives.                                                        |
| **Labels**, **Options**          | Docker's own labels and driver options.                                        |

A network made globally, and **Available in Projects**, can be used by every
project; one made in a project's **Cluster Resources**, by its apps.

Then add it to the apps that need it, in their
[Networks](../configuring-apps/resources-and-placement.md#networks).
