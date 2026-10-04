---
sidebar_position: 3.5
description: 'A new project from a docker-compose.yml: an app per service.'
---

# From a Docker Compose file

Most software you can host yourself ships a `docker-compose.yml`. Paste it, and
HivePaaS creates a project from it: one environment, an app per service, reached
by the same names as in the file, and deployed. It can add the services to a
project you have, too: see [Into an existing project](#into-an-existing-project).

## 1. Paste the file

On **Projects**, open **New Project** and choose **From Docker Compose**:

- paste the compose file, or open it;
- paste its `.env`, if it has one;
- name the project - left empty, it takes the file's own `name:`;
- name the environment, `production` by default;
- choose the **Profiles** whose services are created, if the file has any.

The file is read again as you change anything, and nothing is created until you
confirm. It is read on the server without touching the server: no file of the
server's and none of its environment variables. A file the compose file reads -
an `env_file`, a secret's or a config's file, a file it mounts - is given on the
page.

## 2. Review it

**Variables** are what the file's `${VARIABLES}` are given: the `.env`'s, or a
value typed here over it. A variable whose name reads as a secret - holding
`PASSWORD`, `SECRET`, `TOKEN`, `KEY` and the like - is kept as an encrypted
secret of the environment, which the apps' variables refer to; the containers
get the same value. Uncheck **Secret** to keep it as plain text, or check it for
another. **Generate** fills a secret left empty with a random value. A required
variable, `${NAME:?}`, has to have a value before anything else is shown.

**Files** are the files the compose file reads. Paste each, or open it. One left
missing is created empty, and the app that reads it will not start right until it
is filled, in the environment's **Config Files** or **Secrets**.

**Services** are the apps they become. For each published port, choose:

| Choice                  | What it is                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| **A domain**            | HTTP through Traefik, with TLS, on the domain given - `<app>-<project>.<root domain>` offered. |
| **A port on the nodes** | Published on every node, as compose publishes it.                                              |
| **None**                | Not published: the apps of the environment reach it anyway.                                    |

By default a web server's port - 80, 3000, 5000, 8000, 8080, 8888 - is a domain
when HivePaaS has a root domain; a database's or a broker's - 5432, 3306, 6379,
27017 and the like - and a port bound to `127.0.0.1` are not published, as a
compose file publishes them for a laptop and a server should not; any other is a
port on the nodes.

A service the file only builds has no image to run: give it one, or it is not
created. HivePaaS builds from a Git repository, not from a local directory.

Below is the plan, as an import shows one: what is created, and what HivePaaS
cannot carry over. Uncheck a service to leave it out. **Create project** creates
it all, accepting the plan's issues; **Deploy the apps once they are created** is
on by default.

## Into an existing project

In a project, open **Apps**, then **New From** and **Docker Compose**. The page is
the same, but instead of naming a project you choose the environment: one the
project has - the one picked in the header, at first - or **A new environment**,
named and coloured. A project has ten environments at most.

Nothing the project has is changed: the apps are only added.

- **A service named as an app of the environment** - by its name, or by a name
  that app is reached by - waits for your choice: **Use the env's app, as it
  is**, and the service is not created, the others reaching that app by the
  name; or **Create it under another key**. The others then still reach the
  existing app by the old name, so change the file where they refer to it.
- **A name the environment already answers to** is not added to the new app.
- **A variable's secret** the environment already has is used as it is: the
  value given here is not written. Change it in the environment's **Secrets**.
- **A secret or config file** of the file's whose name the environment has is
  created as `<name>-2`, so the apps read what you gave.

Two environments never share data: an app's directory on the project's volume
is its environment's and its own.

## How a service becomes an app

- **Names.** An app is named after its service, and the other apps reach it by
  that name, as in compose: `db:5432` works. A name HivePaaS keys otherwise -
  `my_db` is the app `my-db` - is still how the others reach it, and so are its
  `container_name`, its `links` and its networks' aliases.
- **Networks.** Every app of the environment is on its one network, and reaches
  every other: the file's own networks are not kept.
- **Volumes.** A named volume is a directory of the project's volume. Several
  services mounting one share the directory of the first that writes to it. A
  directory of the compose file's, such as `./data`, is one too, and starts empty:
  its files are not copied. A file it mounts, such as `./nginx.conf`, is a config
  file of the environment.
- **Variables.** A variable written out in the file whose name reads as a
  secret's, such as `POSTGRES_PASSWORD: example`, is kept as an encrypted secret
  of the app, which the variable refers to. One a `${VARIABLE}` fills follows the
  variable: an environment secret, or plain text if **Secret** is unchecked.
- **Secrets and configs** are the environment's secrets and config files, mounted
  where compose mounts them: `/run/secrets/<name>`, `/<name>`.
- **Commands.** `command`, `entrypoint` and `working_dir` are the app's
  [deployment settings](./docker-image.md#run-options); the healthcheck, the
  restart policy, resources, replicas and placement are its container and service
  settings.
- **A one-off step** - a service with `restart: "no"` that another waits on with
  `condition: service_completed_successfully`, such as a migration - runs to
  completion on each deployment.

The project's volume is a directory on the node HivePaaS runs on, so the apps
with data run there. On a cluster of several nodes, give their data a cluster
volume afterwards, in their **Storage Settings**.

## What is left out

- **`build`**: the image is deployed; without one, the service is not created.
- **The start order**: `depends_on` with `condition: service_healthy` is not
  waited for. An app that starts before what it needs fails, and is restarted
  until it answers - as with `docker stack deploy`.
- **What Swarm services do not have**: `privileged`, `devices`, `network_mode`,
  `pid`, `ipc`, `cpu_shares` and the like are named on the service, and left out.
- **The host**: a directory of the host's is mounted only for an administrator,
  with privileged apps on in **Security**; the Docker socket never - give the app
  [Docker API access](../configuring-apps/resources-and-placement.md#docker-api) instead.
- **Capabilities**, ulimits, sysctls and GPUs take Write on the Cluster module;
  without it, the app is created without them.
- **Labels** for Traefik are dropped: an app is routed by its domains.

Creating a project from a compose file is recorded in the **Audit Logs** as
`compose-import`.
