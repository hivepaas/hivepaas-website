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
ulimits, kernel parameters, [GPUs](#gpus), and Linux capabilities. Changing
capabilities needs **Write** access to the **Cluster** module.

## GPUs

An app is given a GPU in its **Resources**, under **Resource Reservation →
Generic Resources**: the name its node lists its GPUs as, with how many -
**NVIDIA-GPU** or **AMD_GPU**, and `1`. Docker Swarm runs the app on a node
that has that many free, and tells the container which ones are its. While
every GPU is taken, the app waits, and its **Instances** say why: _no
suitable node (insufficient resources)_.

Giving an app a GPU, or taking it away, needs **Write** access to the
**Cluster** module - any generic resource with `GPU` in its name. A Docker
Compose file's `gpus`, or its device reservations for GPUs, reserve
**NVIDIA-GPU**; its `generic_resources` are kept as they are.

### Preparing a node

A node offers its GPUs to apps once Docker on it lists them, and runs its
containers with the GPU maker's runtime, which hands each container the GPUs
Swarm reserved for it. Restart Docker after the changes:
`sudo systemctl restart docker`.

**NVIDIA**

1. Install the NVIDIA driver and the
   [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html).
2. In `/etc/docker/daemon.json`, make NVIDIA's runtime the default and list the
   node's GPUs, one entry each, by the UUID `nvidia-smi -L` prints for it:

   ```json
   {
     "default-runtime": "nvidia",
     "runtimes": {
       "nvidia": { "path": "nvidia-container-runtime", "runtimeArgs": [] }
     },
     "node-generic-resources": ["NVIDIA-GPU=GPU-1d2c3b4a-..."]
   }
   ```

3. In `/etc/nvidia-container-runtime/config.toml`, uncomment `swarm-resource`
   and set it to `"DOCKER_RESOURCE_NVIDIA-GPU"`: Swarm names the GPU it
   reserved for a container in that variable, and the runtime gives the
   container that GPU.

**AMD**

1. Install the ROCm driver and the
   [AMD Container Toolkit](https://instinct.docs.amd.com/projects/container-toolkit/en/latest/container-runtime/overview.html),
   1.2.0 or later.
2. In `/etc/docker/daemon.json`, make AMD's runtime the default and list the
   node's GPUs, one entry each, by UUID, as AMD's
   [Docker Swarm guide](https://instinct.docs.amd.com/projects/container-toolkit/en/latest/container-runtime/docker-swarm.html)
   shows:

   ```json
   {
     "default-runtime": "amd",
     "runtimes": {
       "amd": { "path": "amd-container-runtime", "runtimeArgs": [] }
     },
     "node-generic-resources": ["AMD_GPU=0x..."]
   }
   ```

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

**Autoscale** can set a Replicated app's replicas instead: see
[Autoscale](#autoscale).

:::warning[Changing the mode]

Docker Swarm cannot change the mode of a running service: saving another mode
deletes the app's service and creates it again. The app stops until the new one
is up.

:::

## Autoscale

In **Availability & Scaling**, **Autoscale** sets a Replicated app's replicas
from how busy it is, every 15 seconds, between **Min Replicas** and **Max
Replicas**. A [function](../deploying-apps/functions.md#scale-it) scales on its
calls; any other app on its requests, its CPU or both - with both, the one
asking for more instances wins.

| Field              | What it is                                                                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Min Replicas**   | The fewest instances it keeps, however quiet: 1 or more. `1` by default.                                                                                       |
| **Max Replicas**   | The most it starts, however busy: up to 50. `5` by default.                                                                                                    |
| **Requests**       | The requests one instance handles at once, such as `20`. Counted from Traefik's access log, so only requests through the app's domains. Off by default.        |
| **CPU**            | How much of an instance's CPU limit - or, without one, its reservation - it keeps busy, 10 to 100 %. `70 %` by default; within a tenth of it, nothing changes. |
| **Scale-in Delay** | How long the load stays low before it scales in, 1 minute to 1 hour. `5 minutes` by default.                                                                   |

- **Out** once the load has needed more instances for 30 seconds, then every
  15 seconds while it still does. **At once for a burst**: requests over the
  last 15 seconds needing twice the instances running, or more. Each time to
  twice as many at most, or 4 more when that is more. From CPU, a scale-out
  waits a minute after the last one: a starting container burns CPU.
- **In** once the load has needed fewer for the scale-in delay, by half the way
  down every 15 seconds.
- While it is on, **Replicas** shows the count and only Autoscale changes it; a
  deployment keeps it. A stopped app stays stopped.
- The section lists the latest scalings, with why; the **Metrics** tab draws the
  replicas on the **Requests** and **CPU** charts.
- When replicas cannot start - the cluster has no room, or no node its
  placement allows - it scales no further out until they run, and the section
  says so.

What it reads needs the logs stored, in **System → Logging**: the requests come
from Traefik's access log, the CPU from the rows the HivePaaS agent writes - see
[Logs, metrics and terminal](./logs-and-terminal.md). The requests also need a
domain; the CPU a limit or a reservation, in **Resources**. Each says in the
section when it cannot be read, and why: one that cannot holds the app as it is,
while the other carries on. Autoscale cannot be turned on while none of what
it scales on can be read; one already on says it is paused, and its settings
can still be changed. It reads the minute that ended 10 seconds ago, so
that the lines of every node - and of every Traefik replica - have arrived,
and its last 15 seconds apart, for a burst.

A request is counted when it ends, and for a minute at most. A WebSocket, a
stream of server-sent events or a long poll is not seen while it is open: an
app that serves mostly those scales better on CPU.

An app that publishes a port in **host** mode cannot autoscale: it runs one
replica a node at most.

:::warning[Not every app should]

- **An app that keeps its data in a volume**, such as a database, must not
  autoscale: replicas on one node share the volume, and those on another node
  each have their own. The section warns of an app that writes to one.
- **Sessions kept in memory** are not in the other replicas, and go with an
  instance that is stopped.
- **An instance that is stopped** to scale in gets `SIGTERM`: an app should
  finish its requests then, within its **Stop Grace Period**, in its
  **Container Settings**, or a few of them fail.

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
