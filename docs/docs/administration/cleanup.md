---
sidebar_position: 6
description: "Keeping servers and HivePaaS's records tidy."
---

# Cleanup

Images pile up with every deployment, build caches grow, and HivePaaS's records
of old tasks and deployments add up. A cleanup job clears them on a schedule.

## The cleanup job

**Settings → Data Cleanup** sets it:

| Options                          | What it clears                                                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **DB Cleanup Options**           | HivePaaS's records, once older than their retention: tasks, deployments, audit logs, system errors, deleted objects. |
| **File Cleanup Options**         | Files HivePaaS no longer needs.                                                                                      |
| **Cache Cleanup Options**        | Build caches and repository caches, past their retention.                                                            |
| **Docker Swarm Cleanup Options** | On every node: stopped containers, unused images, networks and volumes, and the build cache, each if chosen.         |

It runs on its schedule: by default every day at midnight in the installation's
timezone, the one the installer asked for. Its schedule is a **Cron Expression**
or an interval.
**Run Cleanup Now** runs it at once. A notification can report each run.

By default, it keeps tasks, deployments, audit logs, system errors and deleted
objects for 90 days, repository caches for 10 days, and the build cache for 30
days.

It also removes apps left behind by a project or environment that was deleted.

**Prune Volumes** deletes anonymous volumes no container uses. Named volumes,
such as apps' storage, are kept.

## System apps

With **System Apps → Sync With Settings**, on by default, each run also brings
the apps HivePaaS runs for itself - the registry, and the logging backend and
collector - to their settings in **System → Registry** and **System →
Logging**:

- One switched off is removed. Its data - the registry's images, the stored
  logs - is kept.
- One switched on but missing is created, and one whose service is gone is
  created again, with its data.
- One running an image or settings other than its own is deployed again.

What a deployment would not mend is reported, not changed: an app scaled to
zero, or one whose containers keep failing. The run then fails, so that its
notification says what needs looking at; its log has the details.

OBI is checked too, on the nodes **System → Logging** lists for performance
data. A node no longer in the cluster is taken off the list. A node whose agent
is not running, or where OBI cannot run - an old kernel, too little memory - is
reported. Nothing is synced while HivePaaS is being updated.

## Clearing caches now

**Force Clear Build Cache** and **Force Clear Repo Cache**, on the same page,
clear those at
once, such as when a build keeps using an outdated layer.

## Backup repositories

Backup repositories are cleaned apart, by the **Backup Repo Cleanup** job: see
[Backup repositories](../backups/backup-repositories.md).
