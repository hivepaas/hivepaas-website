---
sidebar_position: 2
description: "Backing up an app's data, on a schedule or on demand."
---

# Backing up apps

An app's data is backed up by a **data backup**: a scheduled job that takes a
snapshot into a [backup repository](./backup-repositories.md).

## Create a data backup

In the app's **Scheduled Jobs**, create a data backup, and choose what it backs
up under **Back Up**:

**A command's output**, for databases. A command runs in the app's container,
and what it writes is the backup:

| Setting             | What to give                                                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Command**         | A command writing the backup, such as `pg_dump -U $POSTGRES_USER $POSTGRES_DB`.                                            |
| **File Name**       | The backup's name in the snapshot, such as `db.sql`.                                                                       |
| **Restore Command** | Optional: the command that loads it back, such as `psql -U $POSTGRES_USER $POSTGRES_DB`. It reads the backup on its input. |

**A volume**, for files, such as uploads: a volume the app mounts, all of it,
or a **Path** inside it, such as `uploads`.

Then:

- **Backup Repository**: where the snapshots go;
- **Scheduling**: when it runs, such as every day at 3:00;
- **Tags**, to find the snapshots by later;
- **Notification Configuration**, to hear when a backup fails.

:::warning[Databases]

Back up a database with its own tool, through a command. Copying the files of a
database while it writes can give a backup that does not restore.

:::

## Run it now

A data backup runs on its schedule, and by hand from the app's **Scheduled
Jobs**, such as before an upgrade.

## Snapshots

Each run takes a snapshot. The app's **Backup Snapshots** lists them, with when
each was taken, its size, and the job that took it; a project's and the whole
installation's list theirs.

A snapshot's files can be browsed and downloaded: a database dump to load
elsewhere, a file deleted by mistake.

Snapshots are deleted by the repository's
[retention policy](./backup-repositories.md#retention), or by hand.
