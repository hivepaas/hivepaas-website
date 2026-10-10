---
sidebar_position: 1
description: 'The hivepaas command-line client: what it does, picking an app, and the everyday commands.'
---

# CLI

`hivepaas` is the command-line client of HivePaaS: deploy an app and follow the
deployment, read its logs, change its environment variables and secrets, run a
job, open a shell in a container - from your terminal or from a CI pipeline. It
acts through the [REST API](../integrations/rest-api.md), with an API key.

CLI v1.0.0-beta1 is made for HivePaaS v1.0.0-beta4.

## Start

1. [Install it](./install.md), and check the archive you downloaded.
2. [Log in](./log-in.md) with an API key made in the dashboard.
3. Pick an app, below, and run commands on it.

In a pipeline, see [In CI](./ci.md); in a script, [Scripting](./scripting.md).
Every command, its subcommands and flags are in [Commands](./commands/index.md).

## Pick an app

Commands about an app take its project, environment and app:

```bash
hivepaas logs -p shop -e production -a api
```

A project and an app are named by their name, key or ID; an environment by its
name. To stop repeating them, link a directory to the app:

```bash
cd ~/src/shop-api
hivepaas link -p shop -e production -a api
hivepaas logs -f      # the linked app, here and in every directory below
```

`link` writes `.hivepaas.json`. It holds no secret, and can be committed, so
everyone working on the repository deploys the same app. `hivepaas unlink`
removes it.

## Everyday commands

```bash
hivepaas deploy                                    # deploy the app again, as it is set up
hivepaas deploy --image ghcr.io/acme/shop-api:1.4.3
hivepaas deploy --commit "$(git rev-parse HEAD)"   # an app built from Git: this commit
hivepaas ps                                        # where each replica runs, and why one failed
hivepaas logs -f --since 10m
hivepaas logs --search timeout --level error,warn --since 1d
hivepaas env set LOG_LEVEL=debug
hivepaas secret set STRIPE_KEY                     # the value is asked for, not typed on the command line
hivepaas job run migrate                           # a scheduled job, now, waited for
hivepaas exec                                      # a shell in one of the app's containers
hivepaas cp ./config.yaml :/app/config.yaml
hivepaas restart
hivepaas status                                    # what needs attention on the installation
```

`deploy` and `job run` wait for the result, following its logs, and fail when
it fails. Ctrl-C stops the waiting, not the deployment or the run.

`exec` needs the app's terminal turned on, in its settings.

Every command has `--help`, with examples, and its page in
[Commands](./commands/index.md).
