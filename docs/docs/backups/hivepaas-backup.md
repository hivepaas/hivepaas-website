---
sidebar_position: 4
description: "Backing up HivePaaS's own database and configuration."
---

# Backing up HivePaaS

Apart from your apps' data, HivePaaS keeps its own: its database, with your
projects, apps, settings and users. The **system backup** backs it up.

## Turn it on

The system backup is off until you set it up. In **Settings → Data Backup**:

| Setting                 | What to give                                                                           |
| ----------------------- | -------------------------------------------------------------------------------------- |
| **Back Up**             | HivePaaS's database, the spec of the whole installation, or both.                      |
| **Backup Repository**   | A [backup repository](./backup-repositories.md) of the installation, not of a project. |
| **Secrets in the Spec** | **Omit**, **Plaintext**, or **Encrypted** with a **Spec Passphrase**.                  |
| **Scheduling**          | When it runs: daily at 00:30 in the installation's timezone is the default.            |

Then turn it on. **Run Backup Now** takes one at once.

Each run takes one snapshot, with:

- `db.pg_dump`: HivePaaS's database, a dump in `pg_dump`'s custom format;
- `spec.tar.gz`, or `spec.tar.gz.age` when encrypted: the
  [configuration spec](../administration/export-and-import.md) of the whole
  installation.

**Settings → Data Backup** lists the snapshots.

## Secrets in the spec

- **Omit**: the spec holds no secret; importing it asks for every one again.
- **Plaintext**: the spec holds every secret as it is: whoever has the
  repository's password reads them.
- **Encrypted**: the spec is encrypted with a passphrase of its own, besides the
  repository's password. A lost passphrase is a spec whose secrets cannot be
  read.

## Keep the app secret too

The database holds your secrets encrypted with the app secret, which is not in
the backup: it is in `hivepaas.toml`, in HivePaaS's data directory. Keep a copy
of that file apart from the server: without it, the secrets in a database backup
cannot be read.

## Moving to a new server

1. [Install HivePaaS](../installation/install.md) on the new server.
2. Download the latest `spec.tar.gz` from a snapshot of the system backup.
3. [Import](../administration/export-and-import.md#import) it in **Operations →
   Export**.
4. Restore your apps' data from their own backups: see [Restoring](./restoring.md).
