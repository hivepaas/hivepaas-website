---
sidebar_position: 6
description: 'Commands that run on a schedule, or when something happens.'
---

# Scheduled jobs

A scheduled job runs a command in the app's container: on a schedule, when
something happens to the app, or by hand. A nightly database dump, a cache
warm-up after each deployment, a cleanup every hour.

## Create a job

In the app's **Scheduled Jobs**, create a scheduled job:

| Setting                        | What to give                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Name**                       | What the job is, such as `nightly-dump`.                                                               |
| **Command**                    | The command to run in the app's container, or a **Script**.                                            |
| **Scheduling**                 | When it runs: a **Cron Expression**, a **Scheduling Interval**, or **No schedule**.                    |
| Retries and timeout            | How many times to retry a run that fails, how long to wait between tries, and how long a run may take. |
| **Notification Configuration** | Who hears when a run succeeds or fails.                                                                |

A cron expression such as `0 3 * * *` runs the job at 3:00 every day, in the
installation's timezone, the one the installer asked for: the field says which.
A job with **No schedule** runs only by hand, or as a step of a job sequence.

Retry only a command that is safe to run twice.

## Triggers

Beside its schedule, a job can run when something happens to the app:

| Trigger                   | Runs the job                              |
| ------------------------- | ----------------------------------------- |
| **Before a deploy**       | before each deployment updates the app    |
| **After a deploy**        | once a deployment is done                 |
| **A deploy failed**       | when a deployment fails                   |
| **Health check down**     | when one of the app's health checks fails |
| **Health check up again** | when it passes again                      |
| **App enabled**           | when the app is started                   |
| **App disabled**          | when the app is stopped                   |

A **Before a deploy** trigger can hold the deployment until the job's run ends.

## The command's output

A job can keep what its command writes:

- **Save to File**: as a [data file](./storage.md#data-files) of the app, on the
  server or in a cloud storage, compressed with gzip or zstd, and encrypted if
  you give it a secret. `pg_dump` to a daily file is a backup.
- **Pipe to App**: into a command in another app, such as a `pg_dump` of one
  database into a `psql` of another.

## Job sequences

A **job sequence** runs several jobs in order, as one: a dump, then its upload,
then a cleanup. Each step sees the results of the ones before it.

## Data backups

A **data backup** is a job that backs up the app's storage. See
[App backups](../backups/app-backups.md).

## Command templates

Commands used often, in jobs, in the terminal or after a clone, can be kept as
**Command Templates** in the project, with arguments. **Command Pipes** join two
of them: one app's output into another app's input.
