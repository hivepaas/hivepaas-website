---
sidebar_position: 7
description: 'Watching an app, and getting inside it.'
---

# Logs and terminal

## Logs

The app's **Logs** tab shows what its containers write, live, as it happens.

When stored logs are on, the same tab also searches the app's past logs: query
them, choose a time range, keep only warnings and errors, or one stream. An
administrator turns stored logs on in **System → Logging**.

An app's logs are collected from Docker's `json-file` log driver, its default.
An app set to another driver in its **Container Settings** has no logs here.

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
