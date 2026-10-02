---
sidebar_position: 2
description: 'Choosing who hears about what.'
---

# Notification targets

A notification target is a list of who to tell, and through which
[channels](./channels.md): the team's Slack channel and the project's owners by
email, say. Whatever can notify then chooses a target.

## Create a target

In **Integrations → Notification Targets**, globally or in a project, create one,
and turn on the channels it uses:

- **Email**: from a **Sender Email Account**, to any of:
  - **Notify Project Members**, the users with access to the project;
  - **Notify Project Owners**;
  - **Notify Admins**, every admin;
  - **Custom Addresses**, such as `ops@example.com`.
- **Slack**, **Discord**, **Telegram**, **Lark**: through one of their IM
  platforms.

A channel can use its default account, the one marked **Default**, in place of a
chosen one.

Mark a target **Default** for everything that asks for the default target.

## What notifies

Each of these has a **Notification Configuration**, with a target for when it
succeeds, and one for when it fails:

| What                                                                              | Where it is set                               |
| --------------------------------------------------------------------------------- | --------------------------------------------- |
| Deployments                                                                       | the app's **Deployment Settings**             |
| Health checks                                                                     | the app's **Periodic Jobs**                   |
| Scheduled jobs and data backups                                                   | the job                                       |
| Clones                                                                            | the app's **App Clone**                       |
| Certificates                                                                      | the certificate, for when it nears its expiry |
| HivePaaS's own jobs: backup, cleanup, certificate and registry credential renewal | their pages in **Settings**                   |

A common setup: failures to the team's channel, successes to nobody.

## Not too many

A health check that keeps failing would notify on every check. **Min Send
Interval** holds back a notification that repeats the last one sent, within that
time: a failure after a failure. A change, such as the check passing again, is
sent at once.

A target sets its own interval, and a health check can override it.
