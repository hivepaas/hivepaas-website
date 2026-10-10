---
sidebar_position: 12
sidebar_class_name: hp-icon-square-terminal
description: 'Installing the hivepaas command-line client, logging in, and using it from a terminal and from CI.'
---

# CLI

`hivepaas` is the command-line client of HivePaaS: deploy an app and follow the
deployment, read its logs, change its environment variables and secrets, run a
job, open a shell in a container - from your terminal or from a CI pipeline. It
acts through the [REST API](./integrations/rest-api.md), with an API key.

CLI v1.0.0-beta1 is made for HivePaaS v1.0.0-beta4.

## Install

Each release is on the CLI's
[Releases](https://github.com/hivepaas/hivepaas-cli/releases) page, for Linux,
macOS and Windows, on amd64 and arm64:

| System  | Archive                                           |
| ------- | ------------------------------------------------- |
| Linux   | `hivepaas_<version>_linux_<amd64\|arm64>.tar.gz`  |
| macOS   | `hivepaas_<version>_darwin_<amd64\|arm64>.tar.gz` |
| Windows | `hivepaas_<version>_windows_<amd64\|arm64>.zip`   |

On Linux or macOS, download the archive and `checksums.txt`, check the archive,
and put `hivepaas` on your `PATH`:

```bash
v=1.0.0-beta1 os=linux arch=amd64   # os: linux or darwin; arch: amd64 or arm64
base=https://github.com/hivepaas/hivepaas-cli/releases/download/v$v
curl -fsSLO "$base/hivepaas_${v}_${os}_${arch}.tar.gz"
curl -fsSLO "$base/checksums.txt"
sha256sum -c --ignore-missing checksums.txt   # on macOS: shasum -a 256 -c --ignore-missing checksums.txt
tar xzf "hivepaas_${v}_${os}_${arch}.tar.gz" hivepaas
sudo mv hivepaas /usr/local/bin/
hivepaas version
```

On Windows, unzip `hivepaas.exe` into a folder on your `PATH`.

To check that an archive was built by the CLI's release workflow, and not only
that it matches the list beside it, verify its provenance with the
[GitHub CLI](https://cli.github.com):

```bash
gh attestation verify "hivepaas_${v}_${os}_${arch}.tar.gz" --repo hivepaas/hivepaas-cli
```

:::tip[macOS]

Download with `curl` or `gh`, as above. A file downloaded with a browser is
marked as such, and macOS refuses to run it; `xattr -d com.apple.quarantine
hivepaas` lifts the mark.

:::

Shell completion: `hivepaas completion bash`, `zsh`, `fish` or `powershell`
prints the script, and `--help` says where to put it.

## Log in

The CLI acts with an API key. In the dashboard, **Your Account → API Keys**,
create one with what you will do, on the **Project** module: **Read** to look,
**Write** to change settings, **Execute** to deploy, restart, run jobs and open
a shell. See [API keys](./administration/users-and-access.md#api-keys).

Then log in with your installation's address:

```bash
hivepaas login https://hivepaas.example.com
```

It asks for the key's ID and secret; the secret does not show as you type it.
The secret is kept in the OS keychain: macOS Keychain, Windows Credential
Manager, or the Secret Service on Linux. On a server without one, add
`--insecure-storage` to keep it in a file only you can read.

The secret is never an argument, which the shell's history would keep. To read
it from a file or a password manager, pass it on stdin:

```bash
op read op://dev/hivepaas/secret \
  | hivepaas login https://hivepaas.example.com --key-id <key id> --with-secret
```

`hivepaas whoami` says who the key acts as. Each installation you log in to is
a context: `hivepaas context ls` lists them, `hivepaas context use <name>`
switches, and `--context <name>` picks one for a single command. `hivepaas
logout` forgets the current one and its secret.

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

Every command has `--help`, with examples. `-o json` or `-o yaml` prints what a
command shows for a script to read. A command that deletes, restores or creates
many things at once - `app delete`, `backup restore`, `compose up` - asks first
at a terminal; in a script, `--yes` answers.

## In CI

In CI nothing is stored: instead of `login`, set `HIVEPAAS_URL` to the
installation's address and `HIVEPAAS_API_KEY` to `<key id>:<secret>`, from the
CI's secrets. Give the key only what the pipeline does: see
[CI/CD](./integrations/ci-cd.md#an-api-key).

```yaml title=".github/workflows/deploy.yml"
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-24.04
    steps:
      - name: Install the HivePaaS CLI
        run: |
          v=1.0.0-beta1
          base=https://github.com/hivepaas/hivepaas-cli/releases/download/v$v
          curl -fsSLO "$base/hivepaas_${v}_linux_amd64.tar.gz"
          curl -fsSLO "$base/checksums.txt"
          sha256sum -c --ignore-missing checksums.txt
          tar xzf "hivepaas_${v}_linux_amd64.tar.gz" hivepaas
          sudo mv hivepaas /usr/local/bin/

      - name: Deploy, and wait for it
        env:
          HIVEPAAS_URL: https://hivepaas.example.com
          HIVEPAAS_API_KEY: ${{ secrets.HIVEPAAS_API_KEY }}
        run: hivepaas deploy -p shop -e production -a api --image ghcr.io/acme/shop-api:${{ github.sha }}
```

Pin the CLI's version in CI, as above, and move it when you update the
installation. `deploy` fails the job when the deployment fails, and waits up to
30 minutes; `--timeout` changes that.

## Update

```bash
hivepaas update            # the newest release of the CLI's channel
hivepaas update --check    # only say whether there is one
```

A beta CLI follows the beta releases. `update` installs only a release named in
a list signed with HivePaaS's offline release keys, with each archive's SHA-256,
and `--version v1.0.0-beta1` goes back to an earlier one.

## Versions

The CLI is built for an API level, and HivePaaS answers each request with its
own. Against an installation whose API is newer, the CLI still reads and says
so, but the installation refuses its changes until you update it. `hivepaas
version` shows both.

## Exit codes

For scripts, the CLI exits with:

| Code | Meaning                                            |
| ---- | -------------------------------------------------- |
| 0    | done                                               |
| 1    | failed, or `status --fail` found something         |
| 2    | wrong usage, or a question with no terminal to ask |
| 3    | the key is not accepted                            |
| 4    | the key may not do this                            |
| 5    | not found                                          |
| 6    | refused by the installation's checks               |
| 7    | the installation failed                            |
| 8    | a deployment, task or job run that failed          |
| 9    | timed out waiting                                  |
| 10   | the installation's API is newer: update the CLI    |
| 130  | interrupted                                        |
