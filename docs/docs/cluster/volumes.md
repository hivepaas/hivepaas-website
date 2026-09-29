---
sidebar_position: 3
description: "Where apps' data lives, and on which node."
---

# Volumes

A volume is where apps keep data: a directory on a node, a share on your NFS
server, or storage a Docker plugin provides. Apps mount volumes in their
[storage](../configuring-apps/storage.md), and backup repositories can be kept
on them.

## Create a volume

In **Cluster → Volumes**, or a project's **Cluster Resources**, create one:

**Local**, with Docker's own driver:

| Type      | What it is                                                                                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Bind**  | A **Directory** of the node. Left empty, HivePaaS picks one inside its own storage; a path, such as `/mnt/data`, uses that.   |
| **NFS**   | A share of an NFS server: its **Address**, such as `10.0.0.5`, the **Device**, such as `:/exports/data`, and the NFS version. |
| **Tmpfs** | Memory, of a **Size**, such as `1gb`: gone when the container stops.                                                          |

**Custom**: a Docker volume plugin, such as one for Ceph or a cloud's block
storage, with its **Driver Name** and its options.

## Which node

Under **Node**, say where the volume's data is:

- **Current node**, or **a node** you choose: the data is on that node's disk;
- **By node label**: on a node carrying a label;
- **All nodes (shared storage)**: every node reaches the same data, as with NFS,
  or a directory of shared storage mounted at the same path on every node.

This is decided when the volume is made, and does not change: an app whose
storage is on a volume pinned to a node runs on that node.

:::warning[All nodes means the same data]

HivePaaS cannot tell a shared directory from a local one. **All nodes** on a
directory that is really on one node's disk gives each node a different,
empty directory.

:::

## Volumes made outside HivePaaS

**Sync** brings in volumes made with Docker. HivePaaS mounts them by name, and
leaves them as they are.
