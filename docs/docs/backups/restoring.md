---
sidebar_position: 3
description: 'Getting data back from a snapshot.'
---

# Restoring

## Restore a snapshot

In **Backup Snapshots**, the app's or elsewhere, choose the snapshot, and
**Restore Snapshot**:

1. **Restore Into**: the app the data goes into. The snapshot's own app, or
   another, such as a staging copy to try the backup on first.
2. What to restore, depending on the snapshot:
   - **a command's backup** is loaded by a **Restore Command** run in the app,
     which reads the backup on its input, such as
     `psql -U $POSTGRES_USER $POSTGRES_DB`. The data backup's own restore
     command is offered;
   - **a volume's backup** goes into a **Volume** the app mounts, at a
     **Path** inside it. The whole snapshot, or one of its directories.
3. **How**, for a volume, below.
4. **Stop the app while restoring**, so it does not write while its data is
   replaced.

The restore runs as a task: its logs are in the app's **Tasks**.

## Replace or overwrite

A volume's backup is restored one of two ways:

- **Replace**: the directory as it is now is moved aside, and the snapshot is
  restored into an empty one. The app gets exactly what it had at backup time.
  The old directory is kept, named `….before-restore-…`, to go back to; delete
  it once you are sure. Replace always stops the app.
- **Overwrite**: the snapshot's files are written over what is there. Files made
  since the backup stay, and nothing is kept aside.

**Replace** is the one to get an app back to a known state.

## Try it before you need it

A backup is worth what its restore is. Restore one into a copy of the app from
time to time, such as a [clone](../configuring-apps/cloning.md) in `staging`,
and check the app works on it.
