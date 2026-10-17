---
sidebar_position: 4
description: 'Updating HivePaaS to a new version.'
---

# Upgrade

Updating HivePaaS to a new version.

:::info[Being written]

This page is being written. It will cover:

- Release channels, and where the release notes are
- Updating from the dashboard: the update plan, then the update
- What to back up first

:::

## Updating to a release with plans

An installation updated from a release before plans keeps everything it has.
Without a license key, it runs on Bee, the free plan, from then on:

- everything that runs keeps running: apps, functions, previews, users and
  nodes, however many there are;
- Google, Microsoft and OpenID Connect sign-in set up before keeps signing
  people in;
- past one of Bee's limits, nothing more of that kind can be added, and a
  banner says so.

To lift the limits, start a trial or install a key in **System → License**: see
[Plans and licenses](../plans-and-licenses/index.md).
