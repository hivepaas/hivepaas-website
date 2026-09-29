---
sidebar_position: 4
description: 'Rules for which nodes run apps.'
---

# App placement

**Settings → App Placement** sets rules for every app: which nodes may run them.
An app's own placement, in its
[Availability & Scaling](../configuring-apps/resources-and-placement.md#placement),
comes on top.

## The rules

| Rule                      | Keeps apps                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Exclude Manager Nodes** | off the managers, which run HivePaaS itself. On by default.                                             |
| **Exclude Build Nodes**   | off the nodes **Settings → Image Build** sets to build images. On by default.                           |
| **Require Node Labels**   | on nodes carrying all of these labels, such as `tier=apps`. A bare key, such as `apps`, is `apps=true`. |
| **Exclude Node Labels**   | off nodes carrying any of these labels.                                                                 |

## On a single node

With one node, the rules are not applied: it is the manager, it builds, and
it runs every app. They apply once the cluster has a second node.

## When they apply

The rules apply to an app when it is deployed. After adding the first worker,
or changing the rules, **Re-deploy** the apps to move them.

A set of rules no node satisfies would leave apps waiting forever: HivePaaS
refuses to save it.
