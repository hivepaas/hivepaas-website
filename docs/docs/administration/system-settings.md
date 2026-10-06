---
sidebar_position: 3
description: "HivePaaS's own settings: its services, domains, updates, Traefik, logging and registry."
---

# System settings

The **System** menu holds the settings of HivePaaS itself. Only an admin sees it.

## HivePaaS

**System → HivePaaS** has:

- **General**: HivePaaS's replicas and its worker, how often it runs its
  background work, and the proxy in front of it, if any. A proxy such as
  Cloudflare needs its **Proxy Provider**, **Trusted IPs** and **Proxy Hops**, so
  HivePaaS sees each request's real address.
- **Routing Settings**: the dashboard's domains, up to two, their
  certificates, and the addresses allowed to reach them. HivePaaS limits the
  rate of requests to its sign-in and system endpoints itself; the domain as a
  whole has no rate limit, which would count every script of the dashboard.
- **Security**: see [Sign-in and security](./sign-in.md#hivepaass-own-security).
- **Updates**: the release channel, **stable** or **beta**, and updating
  HivePaaS. See [Upgrade](../installation/upgrade.md).
- **Actions**: restarting HivePaaS.

### Changes that could lock you out

A change to the dashboard's routing, or to the proxy in front of it, is applied
on trial. The dashboard counts down, and the change is undone unless you confirm
it, through the new configuration, before the time is up. A change that made the
dashboard unreachable undoes itself. See
[Recovering from a bad change](../troubleshooting/recovering-from-a-bad-change.md).

## Traefik

**System → Traefik** sets the proxy in front of every app: its replicas, log
level, access log, HTTP/3, and extra command-line arguments. The access log is
what an app's HTTP numbers are counted from, in its
[Metrics](../configuring-apps/logs-and-terminal.md#metrics) tab: **Access Log**
writes it as JSON, without the query string, and with only the fields HivePaaS
counts by and a few to read a line by. To keep another field too, add it to the
arguments, such as `--accesslog.fields.names.StartUTC=keep`. **Open Ports** lists
the ports Traefik opened for apps' TCP domains.

Traefik's startup command is applied on trial too.

## Logging

**System → Logging** turns on stored logs: a collector on every node, and a
backend, VictoriaLogs, that keeps the logs and answers the apps' **Logs** tabs.
Set:

- how long logs are kept, such as `30d`, and how full the disk may get;
- the memory and CPU the backend may use;
- other destinations to send the logs to, over HTTP, if you have a log store of
  your own.

Without it, apps show their live logs only.

### Routes and calls

**System → Logging → Routes and Calls** runs OBI, an eBPF program, on the nodes
you choose, to measure the routes and calls of the apps whose **Feature
Settings** ask for them: see
[Routes and calls](../configuring-apps/logs-and-terminal.md#routes-and-calls).

A node needs:

- Linux 5.8 or later, with BTF (`/sys/kernel/btf/vmlinux`), as the kernels of
  current distributions have;
- to be a VM or a dedicated server: a container-based VPS, OpenVZ or LXC, runs
  on its host's kernel and cannot run OBI;
- twice the memory its capacity takes free, when OBI starts.

The page lists every node with what its agent last found: whether it can run
OBI, and why not.

A node's **Capacity** is how many requests and connections OBI tracks there at
once. OBI takes its memory whole when it starts, idle or not; too small a
capacity loses what does not fit, without saying so.

| Capacity | Memory   | Tracked at once | Recommended for  |
| -------- | -------- | --------------- | ---------------- |
| Small    | ~100 MiB | ~7,500          | nodes under 8 GB |
| Medium   | ~140 MiB | ~15,000         | 8 to 32 GB       |
| Large    | ~215 MiB | ~30,000         | 32 GB and more   |

**Recommended**, the default, follows the node's memory.

The memory in the table is a one-core node's. OBI takes more on a node with
more cores, and when busy: Small took up to about 230 MiB on 10 cores under
heavy load. Its container is limited to 512 MiB.

OBI also costs each request it measures about 14 µs of CPU, in the app and in
OBI itself: a percent or two for an app whose requests use a millisecond of
CPU, more for one that answers trivial requests at its CPU's limit.

OBI runs while stored logs are on: its numbers are kept with them. Each node's
HivePaaS agent starts, changes or stops it within 30 seconds of a save. While
**Routes and Calls** is off, the agents check every 10 minutes that no OBI
runs, and say which nodes could run it.

Each HivePaaS release names the OBI it runs. An update moves it with the agent:
each node's agent pulls the new OBI while the old one still runs, then swaps
them. The old image goes with the daily system cleanup, which prunes unused
images on every node.

## Registry

**System → Registry** runs a registry in the cluster, so an image built on one
node can run on every other one. It keeps the images on a node's volume, or in a
cloud storage bucket, and removes old builds, keeping the newest of each app.

Builds push to it once it is on: see
[From a Git repository](../deploying-apps/git-repository.md#more-than-one-node).

## AI

**System → AI** turns on HivePaaS's MCP server, for AI assistants. See
[MCP server](../integrations/mcp-server.md).

## Settings for every project

The **Settings** menu holds settings that apply to all projects:

- **Image Build**: how and where images are built;
- **App Placement**: which nodes run apps, see [App placement](../cluster/app-placement.md);
- scheduled jobs of HivePaaS's own: **Data Backup**, **Data Cleanup**,
  **Backup Repo Cleanup**, **SSL Renewal** and **Registry Auth Renewal**, which
  renews the tokens of Amazon ECR credentials: see
  [Amazon ECR](../deploying-apps/docker-image.md#token-renewal).
