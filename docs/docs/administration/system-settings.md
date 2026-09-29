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
- **Routing Settings**: the dashboard's domains, up to two, and their
  certificates and rules.
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
level, access log, HTTP/3, and extra command-line arguments. **Open Ports** lists
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
  **Backup Repo Cleanup** and **SSL Renewal**.
