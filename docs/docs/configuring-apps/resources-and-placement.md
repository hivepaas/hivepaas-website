---
sidebar_position: 4
description: 'CPU and memory, replicas, and the nodes an app runs on.'
---

# Resources and placement

## Resources

In the app's **Resources**:

- **Resource Limit**: the most **CPUs** and **Memory** the app may use. An app
  that goes over its memory limit is stopped and restarted.
- **Resource Reservation**: the CPUs and memory kept for the app. A node without
  that much free does not run it.

Memory takes sizes such as `512mb` or `1gb`, CPUs numbers such as `0.5` or `2`.

Set a memory limit on every app: an app without one can take the memory of every
other app on its node.

The same page has the finer settings: swap, `/dev/shm` size, process limits,
ulimits, kernel parameters, GPUs, and Linux capabilities. Changing capabilities
needs **Write** access to the **Cluster** module.

## Replicas and modes

In the app's **Availability & Scaling**, **Service Mode** says how the app runs:

| Mode               | Runs                                                      |
| ------------------ | --------------------------------------------------------- |
| **Replicated**     | **Replicas** instances, spread over the nodes.            |
| **Global**         | One instance on every node, kept running.                 |
| **Replicated Job** | A set number of times, **Total Completions**, then stops. |
| **Global Job**     | Once on every node, then stops.                           |

Most apps are **Replicated**. More than one replica shares the app's traffic, and
keeps it answering when one instance stops, provided the app keeps no state in
its own container.

A [function](../deploying-apps/functions.md#scale-it) can have its replicas set
by **Autoscale**, from its calls.

:::warning[Changing the mode]

Docker Swarm cannot change the mode of a running service: saving another mode
deletes the app's service and creates it again. The app stops until the new one
is up.

:::

## Placement

Also in **Availability & Scaling**:

- **Placement Constraints** say which nodes may run the app, by their role, name
  or labels, such as `node.labels.disk == ssd`.
- **Placement Preferences** spread the app's replicas over the values of a
  label, such as one per zone.

The app's **Instances** tab shows where each instance landed, and why one that
could not start did not.

Rules for every app, such as keeping apps off the node HivePaaS runs on, are in
**Settings → App Placement**: see [App placement](../cluster/app-placement.md).

## Networks

An app is on its environment's network already. Its **Networks** add others,
publish ports on the nodes for an app that serves something other than HTTP,
and set DNS and hosts file entries.

## Docker API

Some apps drive Docker themselves: a CI runner, a Docker manager. Their
**Docker API** gives them one, through a HivePaaS proxy that lets them manage
their own containers, networks and volumes, and nothing else on the node.
