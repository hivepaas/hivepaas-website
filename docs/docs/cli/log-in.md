---
sidebar_position: 3
description: 'Logging the hivepaas CLI in with an API key, and working with several installations.'
---

# Log in

## An API key

The CLI acts with an API key. In the dashboard, **Your Account → API Keys**,
create one with what you will do, on the **Project** module: **Read** to look,
**Write** to change settings, **Execute** to deploy, restart, run jobs and open
a shell. See [API keys](../administration/users-and-access.md#api-keys).

## Logging in

Log in with your installation's address:

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

`hivepaas whoami` says who the key acts as.

## Several installations

Each installation you log in to is a context, named after its host unless
`login --name` names it:

```bash
hivepaas login https://staging.example.com --name staging
hivepaas context ls                 # the contexts, and which is current
hivepaas context use staging        # make another one current
hivepaas ps --context hivepaas.example.com   # one command on another
hivepaas logout                     # forget the current one, and its key's secret
```

In CI nothing is stored, and no context is needed: see [In CI](./ci.md).
