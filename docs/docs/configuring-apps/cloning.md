---
sidebar_position: 8
description: 'Copying an app, with its settings and data, to another environment.'
---

# Cloning apps

Cloning copies an app into another environment of its project, or the same one
under another name: a staging copy of production, a copy to try an upgrade on.

## Clone an app

In the app's **App Clone**:

1. Name the copy, under **Target Name**, and choose its **Target Environment**.
2. Choose what to copy.
3. Click **Save and Clone**.

The settings are kept, so the next clone of the app is one click.

## What it copies

| Setting                            | Copies                                                                     |
| ---------------------------------- | -------------------------------------------------------------------------- |
| **Clone Deployment Configuration** | The app's source and how it is built and run.                              |
| **Clone Routing Configuration**    | Its routing, with a **Domain** for the copy in place of each of the app's. |
| **Clone Env Variables**            | Its env vars.                                                              |
| **Clone Secrets**                  | Its secrets.                                                               |
| **Clone Config Files**             | Its config files, and the setting mounts that read them.                   |
| **Clone Periodic Jobs**            | Its health checks.                                                         |
| **Clone Scheduled Jobs**           | Its scheduled jobs.                                                        |
| **Clone Volumes**                  | Its storage mounts, and with **Clone Volume Data**, the data on them.      |

A **Domain** is the app's with `clone-` in front until it is changed:
`clone-shop.example.com` for `shop.example.com`. Without **Clone Routing
Configuration**, the copy has no domain; it is not reachable from outside until
it is given one.

With **Clone Volumes**, each of the copy's mounts is a directory of its own,
named after the copy, on the same volume: empty, or a copy of the app's with
**Clone Volume Data**. Without it, the copy has no storage: it never reads or
writes the app's.

**Target Status** and **Target Replicas** say whether the copy starts, and with
how many instances.

## Copying data

Two ways, for two kinds of data:

- **Clone Volume Data** copies the storage's files. It suits files, such as
  uploads. For a database, tick **Stop Source App Before Clone**: copying the
  files of a database while it writes can leave a copy that is broken.
- **Post-Clone Commands** run **Command Pipes** once the copy exists, such as a
  `pg_dump` of the app into a `pg_restore` of the copy. A database's own tools
  give a consistent copy without stopping the app.

## When a clone ends

A clone runs as a task, listed in the app's tasks with its log. One that fails
leaves no app behind, and its task says why.

To be told how it ended, choose a [notification target](../notifications/notification-targets.md)
under **Notification Configuration**, for success, for failure, or both. The
message names the copy and, for a failure, the reason. Nobody is told until a
target is chosen.

## Clones for previews

The database apps a [pull request preview](../deploying-apps/pr-previews.md)
clones use their **App Clone** settings: set them up before adding the
databases to the preview's **DB Apps to Clone**.
