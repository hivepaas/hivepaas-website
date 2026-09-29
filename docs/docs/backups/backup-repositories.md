---
sidebar_position: 1
description: 'Where backups are kept: S3-compatible storage, or a volume.'
---

# Backup repositories

A backup repository is where backups go. HivePaaS keeps them with
[Kopia](https://kopia.io), which:

- **encrypts** every backup with the repository's password;
- **deduplicates**: a backup stores only what changed since the last one, so a
  daily backup of a large volume stays small;
- **compresses** what it stores.

## Where a repository lives

- **A cloud storage**: a bucket on AWS S3, Cloudflare R2, Backblaze B2, MinIO or
  any S3-compatible service. Off your servers, which is the point of a backup.
- **A volume** of the cluster: on one of your nodes' disks. Quick, but lost with
  the node.

A cloud storage is set up first, in **Integrations → Cloud Storages**, with a key
auth holding its access key.

## Create a repository

In **Integrations → Backup Repos**, globally or in a project, create one:

| Setting               | What to give                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------- |
| **Storage**           | The cloud storage, or the volume.                                                           |
| **Storage Path**      | A directory inside it, such as `hivepaas/prod`, for several repositories to share a bucket. |
| **Password**          | The key every backup in it is encrypted with.                                               |
| **Compression Level** | How hard to compress.                                                                       |
| **Retention Policy**  | Which backups to keep.                                                                      |

:::warning[Keep the password]

Without the repository's password, its backups cannot be read, by anyone. Keep
a copy of it outside HivePaaS.

:::

The storage, the storage path and the password are fixed once the repository
exists. The password can be changed later, with its own action.

### An existing repository

**Import Existing**, in place of creating a new one, connects to a repository
already in the storage, such as one of a previous installation: give its storage
path and its password.

## Retention

The **Retention Policy** keeps:

- **Keep Last**: the newest backups, however many;
- **Keep Hourly**, **Keep Daily**, **Keep Weekly**, **Keep Monthly**: the last
  backup of each of that many hours, days, weeks and months.

A backup is kept if any rule keeps it. A rule left empty adds no limit: it
deletes nothing.

## Cleanup

The **Backup Repo Cleanup** job, in **Settings**, runs daily: it deletes the
backups the retention policy no longer keeps, and frees their space. **Run
Cleanup Now** runs it at once.
