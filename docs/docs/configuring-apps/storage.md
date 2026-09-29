---
sidebar_position: 3
description: 'Volumes, and data that outlives a container.'
---

# Storage

A container's own files go when the container does: on every deployment, and
every restart on another node. Data an app must keep, such as a database's
files or uploads, goes on storage.

## Add storage

In the app's **Persistent Storage**, add a storage mount:

| Setting       | What to give                                                                     |
| ------------- | -------------------------------------------------------------------------------- |
| **Volume**    | A volume of the cluster, where the data lives.                                   |
| **Target**    | Where the data appears in the container, such as `/var/lib/postgresql`.          |
| **Subpath**   | Optional: a directory of the app's storage to mount, instead of the whole of it. |
| **Read-only** | For data the app only reads.                                                     |
| **No Copy**   | Leaves out what the image has at the target, when the storage is first mounted.  |

The app gets a directory of its own in the volume: two apps on the same volume
do not see each other's data.

Volumes are set up in **Cluster → Volumes**, or in the project's cluster
resources.

### Storage that already has data

Adding storage checks what is there. A directory that already holds data, such
as the data of an app of the same name that ran here before, is used as it is:
**This storage already has data** says so before you save.

## Another app's data

An app can mount the storage of another app of its environment: a file manager
on a web app's uploads, or a backup tool on a database's files. Choose the other
app under **Data of**, and tick **Allow writing** only if it must change them.

The app whose data it is lists who mounts it, under **Apps reading this app's
storage**.

## Permissions

An app whose user cannot write its files, often after an image changes its
user, can have them fixed with **Reset permissions**:

- **Give to a user** makes a user and group own the files, keeping their modes;
- **Open to every user** lets any user read and write them.

## Data files

The app's **Data Files** are files kept with it, such as a database's dumps:
uploaded from your computer, registered from a cloud storage, or written by a
[scheduled job](./scheduled-jobs.md)'s output. Each has a kind, such as
`postgres-backup`.

A file registered from a cloud storage stays there: HivePaaS records where it
is, and does not download it.

## Backups

Storage is on the disks of your nodes. Back it up with
[app backups](../backups/app-backups.md).
