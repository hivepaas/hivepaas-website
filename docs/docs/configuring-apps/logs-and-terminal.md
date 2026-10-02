---
sidebar_position: 7
description: 'Watching an app, and getting inside it.'
---

# Logs, metrics and terminal

## Logs

The app's **Logs** tab shows what its containers write, live, as it happens.

When stored logs are on, the same tab also searches the app's past logs: query
them, choose a time range, keep only warnings and errors, or one stream. An
administrator turns stored logs on in **System → Logging**.

An app's logs are collected from Docker's `json-file` log driver, its default.
An app set to another driver in its **Container Settings** has no logs here.

## Metrics

The app's **Metrics** tab counts the HTTP requests that reach it by its domains,
over the last hour, 6 hours, 24 hours or 7 days:

- **Requests**, by what the client got: `2xx` and `3xx`, `4xx`, `5xx`;
- **Unreachable**: the requests Traefik could not get to the app at all - no
  container running, or none answering;
- **Duration**: p50, p95 and p99, from the client to the app's answer, close
  rather than exact;
- **Paths**: the 20 most requested, with numbers and ids counted as one -
  `/users/:n`, `/orders/:id`;
- **Replicas**: the requests each of the app's containers answered.

They are counted from Traefik's access log, which HivePaaS stores with the
logs: stored logs must be on, in **System → Logging**. Traefik writes the access
log as JSON and without the query string, which can carry a token or an email;
the client's IP address is kept.

An installation from before this writes the access log in an older form: the
tab says so. An administrator saves **System → Traefik → Config Options** once,
with **Access Log** on - Traefik restarts, which takes a few seconds, on trial
as any change of its startup command.

An app with no domain has no requests through Traefik, and no HTTP numbers. A
[function](../deploying-apps/functions.md) has its calls there too, under
**Calls**.

Under **Resources**, the same tab shows what the app's containers use, summed
over them:

- **CPU**, in cores, and the limit set in the app's **Resources** settings;
- **Memory**, the working set as `docker stats` counts it - the page cache the
  kernel can take back left out - and its limit;
- **Network**, in and out, in bytes a second;
- **Containers**: each container's CPU, its peaks, and the times the kernel
  killed it for running out of memory (**OOM kills**).

The HivePaaS agent on each node reads them from every app container's cgroup
every 15 seconds, while stored logs are on, and stores them with the logs. A
node needs cgroup v2, which every current Linux distribution uses.

## Terminal

The app's **Terminal** tab opens a shell in one of its containers, in the
browser. Choose the container, and the **Shell**, such as `sh` or `bash`, among
those the image has.

The terminal can:

- insert a command from the project's **Command Templates**;
- search its output, and go full screen;
- **Import Files to Container**: upload a file, or an archive it extracts, to a
  path in the container;
- **Export Container Files**: download a file or a directory of the container,
  compressed if you like.

What the terminal changes in a container is lost when the container is
replaced, on the next deployment or restart. Data to keep belongs on
[storage](./storage.md).

## Instances

The app's **Instances** tab lists its containers: the node each runs on, its
state, how long it has run, and the error of one that failed to start.

## Turning them off

The terminal, the logs and scheduled jobs are on for every app. An app's
**Feature Settings** can turn each of them off, such as the terminal of an app
that handles sensitive data.
