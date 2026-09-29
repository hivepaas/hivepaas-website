---
sidebar_position: 4
description: 'What is running, and what was done by whom.'
---

# Tasks and audit logs

## Tasks

A task is work HivePaaS runs in the background: a deployment, a backup, a
scheduled job's run, a certificate, a clone, a cleanup.

**Operations → Tasks** lists them, for the whole installation; a project's and an
app's **Tasks** list theirs. For each task:

- its type, the object it works on, its status, and how long it took;
- its steps and logs, and its error if it failed;
- its retries, and when the next one runs.

**Cancel** stops a task that has not finished.

## Audit logs

An audit log records a change: what was done, to what, by whom, and when.

**Operations → Audit Logs** lists them, for the whole installation; a project and
each of its environments have theirs. Filter them by type, result, source, or
who did it. For each entry:

- the user, and the API key if they used one;
- their address and browser, and the request;
- the object changed, and the project and app it is in.

Changes HivePaaS makes on its own, such as its daily cleanup, are recorded too,
under their own source.

Audit logs are kept for as long as **Settings → Data Cleanup** says: see
[Cleanup](./cleanup.md).
