---
sidebar_position: 2
description: 'Installing the hivepaas CLI, checking what was downloaded, and updating it.'
---

# Install and update

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

## Shell completion

`hivepaas completion bash`, `zsh`, `fish` or `powershell` prints the script;
[`completion`](./commands/completion.md) says where each shell reads it from.

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
