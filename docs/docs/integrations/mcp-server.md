---
sidebar_position: 3
description: 'Letting AI assistants read and manage HivePaaS, over the Model Context Protocol.'
---

# MCP server

HivePaaS serves the [Model Context Protocol](https://modelcontextprotocol.io),
so an AI assistant, such as Claude, Codex, Gemini, Cursor or Copilot, can work
with it: find out why an app is down, read its logs, install an app from the app
store, redeploy one, schedule a job.

The assistant acts as an API key's user, within what the key may do. It never
deletes anything, and it changes nothing without showing you the change first.

## Turn it on

In **System → AI**:

- **Enabled** serves the MCP server. While it is off, its address answers `404`.
- **Allow changes** lets assistants make changes, for keys that may make them.
  Off, an assistant only reads, whatever the key may do.

The server's address is the **Endpoint** on the same page:
`https://hivepaas.example.com/api/mcp`. Clients connect to it over streamable
HTTP.

## An API key for the assistant

The server takes an API key, and nothing else. Create one in **Your Account → API
Keys**, and give it what the assistant should do, on the **Project** module:

| The assistant                                                                           | The key needs |
| --------------------------------------------------------------------------------------- | ------------- |
| reads apps, logs, deployments, tasks and the app store                                  | **Read**      |
| restarts, stops, starts and redeploys apps                                              | **Execute**   |
| installs apps, creates and tries functions, changes their configuration, schedules jobs | **Write**     |

Leave the key's **Reveal secrets** capability off. The MCP server never asks for
a secret, and without the capability the key cannot be used to read one through
the API either. A key with **Write** can still route a secret somewhere it can be
read - into an env var that a command prints, or a function's test run that
prints it - so give **Write** only to an assistant you would trust with the
secrets.

**System → AI** makes one for you, without the capability: **Create a read-only
key**, or **Create a key that can make changes**. The page checks a key you
paste, and fills it into the setup of each client below.

## Connect a client

The key is sent as `Authorization: Bearer <key ID>:<secret>`, or in the headers
`HIVEPAAS-API-KEY-ID` and `HIVEPAAS-API-SECRET-KEY`.

### Claude Code

```bash
claude mcp add --transport http hivepaas https://hivepaas.example.com/api/mcp \
  --header "HIVEPAAS-API-KEY-ID: <key ID>" \
  --header "HIVEPAAS-API-SECRET-KEY: <secret>"
```

Add `--scope user` to have it in every project. `/mcp` in Claude Code shows
whether it connected.

### Codex CLI

Keep the key in your shell's environment, in `~/.zshrc` or `~/.bashrc`:

```bash
export HIVEPAAS_MCP_TOKEN="<key ID>:<secret>"
```

Then add the server:

```bash
codex mcp add hivepaas --url https://hivepaas.example.com/api/mcp \
  --bearer-token-env-var HIVEPAAS_MCP_TOKEN
```

### Gemini CLI

```bash
gemini mcp add --transport http \
  --header "Authorization: Bearer <key ID>:<secret>" \
  hivepaas https://hivepaas.example.com/api/mcp
```

### Cursor

In `~/.cursor/mcp.json`, or `.cursor/mcp.json` in a project:

```json
{
  "mcpServers": {
    "hivepaas": {
      "url": "https://hivepaas.example.com/api/mcp",
      "headers": { "Authorization": "Bearer <key ID>:<secret>" }
    }
  }
}
```

The key is in the file as it is: keep a project's `.cursor/mcp.json` out of
version control.

### VS Code (Copilot)

In `.vscode/mcp.json`, or the file **MCP: Open User Configuration** opens:

```json
{
  "inputs": [
    {
      "type": "promptString",
      "id": "hivepaas-key",
      "description": "HivePaaS API key, as <key-id>:<secret>",
      "password": true
    }
  ],
  "servers": {
    "hivepaas": {
      "type": "http",
      "url": "https://hivepaas.example.com/api/mcp",
      "headers": { "Authorization": "Bearer ${input:hivepaas-key}" }
    }
  }
}
```

VS Code asks for the key the first time the server starts, and keeps it out of
the file.

### Claude Desktop

Claude Desktop connects to a remote server through `mcp-remote`, which needs
Node.js. In `claude_desktop_config.json` (**Settings → Developer → Edit
Config**), then restart Claude Desktop:

```json
{
  "mcpServers": {
    "hivepaas": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://hivepaas.example.com/api/mcp",
        "--transport",
        "http-only",
        "--header",
        "Authorization:${AUTH_HEADER}"
      ],
      "env": { "AUTH_HEADER": "Bearer <key ID>:<secret>" }
    }
  }
}
```

ChatGPT's and claude.ai's connectors take OAuth only, which HivePaaS does not
offer yet: use one of the clients above.

## What an assistant can do

**Read**, with a key that may read:

- projects, apps, their status, settings and deployments;
- an app's logs, and a search through its stored logs;
- a function's calls: how many, how many failed, and how long they took;
- an app's [pull request previews](../deploying-apps/pr-previews.md);
- tasks and their logs, what needs attention, the cluster's nodes and volumes;
- the app store: its catalog, templates, and their image tags;
- the env vars that connect an app to a database, a cache or a store of its
  env, as **Link to another app** suggests them, and those a database's image
  reads to set itself up, as **Suggest Env** does;
- a project's and an env's settings: their env vars, the project's domain
  settings, certificates, config files, secrets (by name, their values
  masked), registry and Git credentials, backup repositories and backups,
  networks, notifications, and the audit log.

**Change**, with a key that may, and **Allow changes** on:

- restart, stop, start or redeploy an app, or cancel a deployment;
- install an app from the app store, or create an app to run an image of your
  own;
- create a project from a [Docker Compose file](../deploying-apps/docker-compose.md),
  told first what each service becomes and what is left out;
- create a [function](../deploying-apps/functions.md) from its code, or try a
  function's code with a request before saving it. A test run answers what the code prints as it is: code
  that prints a secret shows it;
- change an app's settings, or the env vars of a project or an env;
- make a preview of an app from a pull request or a branch, told first which
  secrets it goes without;
- create a scheduled job - a command, or a request to a function - or run one
  now.

Nothing is ever deleted through the MCP server.

## Changes are planned first

A change takes two steps:

1. The assistant **plans** it: HivePaaS answers what would happen, and changes
   nothing. The assistant shows you the plan.
2. Once you agree, the assistant **applies** exactly that plan.

A plan is good for 10 minutes, once, and only for whoever made it. If what it
saw has changed since, such as an app redeployed in between, applying it is
refused, and the assistant plans again.

## Guided tasks

Clients that offer prompts get these, to start from:

- **debug_app**: finds out why an app is not working, from its status, logs and
  deployments, and plans a fix the tools can make, or says what would.
- **install_app**: installs an app from the app store, asking for what the
  template needs.
- **deploy_image**: runs a Docker image of your own: creates the app, gives it
  its image, port, domain and variables, and deploys it, a plan at a time.
- **deploy_function**: writes a function with you, creates it on a runtime -
  Node.js, Bun, Python or Go - deploys it and tries it with a request.
- **connect_app_to_database**: adds the env vars that connect an app to a
  database or cache of its env, as references.
- **run_database_from_image**: sets up an app that runs a database's own image
  from its App Kind's credentials.
- **expose_database**: gives a database a TCP domain, so a client outside the
  cluster can reach it - or says why MySQL and MariaDB need a published port.

The database prompts follow a guide the server offers as a resource, **Databases on
HivePaaS**; the function prompt, **Functions on HivePaaS**, which says how a
handler is written for each runtime.

## Keeping an eye on it

**Recent calls**, in **System → AI**, lists the assistants' calls: when, which
tool, as which user, and whether it was answered or refused. Every change an
assistant makes is also in the [audit logs](../administration/tasks-and-audit-logs.md),
with the API key it used.
