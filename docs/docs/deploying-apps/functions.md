---
sidebar_position: 4
description: 'A function: code and a runtime, built and run by HivePaaS, called once per request.'
---

# Functions

A function is an app whose deployment is code and a runtime. You write a
handler; HivePaaS builds it on the runtime's image and runs it as a server that
calls the handler once for every request. There is no Dockerfile and no server
to write.

A function is an app like any other: it has its env vars and secrets, its logs,
its deployments, its instances and its terminal. It answers HTTP requests at a
domain, or inside its project, and on a schedule.

## Create a function

In the project's **Apps** tab, click **New Function**:

| Field                  | What it is                                                                                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**               | The function's name, such as `hello`.                                                                                                                |
| **Environment**        | The environment it runs in.                                                                                                                          |
| **Runtime**            | **Node.js 24**, **Bun 1**, **Python 3.13** or **Go 1.27**. See [Runtimes](#runtimes).                                                                |
| **Language**           | For Node.js: **JavaScript** or **TypeScript**.                                                                                                       |
| **Code**               | **Write it here**: start from the runtime's template, and edit it in the **Code** tab. **From a repository**: build it from a Git repository's code. |
| **Expose at a domain** | Routes the function at a domain, over HTTPS. Off, it is reached inside its project only.                                                             |

From a repository, give the **Repository URL**, its **Git Credentials** for a
private one, the **Ref** - a branch, a tag or a commit, the default branch when
empty - and the **Directory** of the function in the repository. **Deploy on
Push** deploys the function each time the branch is pushed, once the
repository's webhook or GitHub App tells HivePaaS of it: see
[Automatic deployments](./auto-deploy.md).

**Create Function** creates it and starts its first deployment at once.

## Runtimes

| Runtime         | Language                                         | Handler's file | Handler   |
| --------------- | ------------------------------------------------ | -------------- | --------- |
| **Node.js 24**  | JavaScript, or TypeScript with its types removed | `index.js`     | `default` |
| **Bun 1**       | JavaScript or TypeScript                         | `index.ts`     | `default` |
| **Python 3.13** | Python                                           | `main.py`      | `handler` |
| **Go 1.27**     | Go, compiled                                     | `.`            | `Handle`  |

The handler's file and its name are the defaults of the function's settings,
and can be changed there.

- **TypeScript on Node.js** runs as Node.js 24 runs it: the types are removed as
  the file loads, and are not checked. Only syntax that can be removed is
  allowed - no `enum`, no `namespace` holding values, no parameter properties,
  no decorators. An import names the file with its extension,
  `./lib/util.ts`, and a type from another file is imported with
  `import type`.
- **Bun** runs TypeScript whole, `enum` and `namespace` included. Its types are
  not checked either.
- **Python** serves with a process per CPU of the function's limits, at most
  one per 128 MiB of its memory limit. Set `WEB_CONCURRENCY` in its env vars to
  choose the number. An `async def` handler is the fastest, but must not block:
  blocking code, such as `time.sleep` or `requests`, belongs in a plain `def`.
- **Go** compiles the function's package. Its handler's file is the package's
  directory, `.` for the module's root.

## The handler

A handler takes the request and returns the response:

```js title="Node.js, Bun - index.js"
export default async function (req, ctx) {
  ctx.log(`${req.method} ${req.path}`);
  return { status: 200, body: { hello: req.query.name ?? 'world' } };
}
```

```python title="Python - main.py"
def handler(req, ctx):
    return {"status": 200, "body": {"hello": req.query.get("name", "world")}}
```

```go title="Go - handler.go"
package function

import (
	"context"

	"github.com/hivepaas/function-runtimes/hivepaas"
)

func Handle(ctx context.Context, req *hivepaas.Request) (*hivepaas.Response, error) {
	return hivepaas.JSON(200, map[string]string{"hello": req.Query.Get("name")})
}
```

**The request** has the method, the path without its query, the query, the
headers - their names in lower case - and the body, as bytes, as text
(`text()`) or as JSON (`json()`).

**The response** is an object with `status`, `headers` and `body`:

- a body that is text is sent as `text/plain`, bytes as
  `application/octet-stream`, anything else - an object, a list - as JSON;
- a `Content-Type` among the headers replaces that;
- returning nothing answers `204`, and leaving out `status` answers `200`.

**The context** has the call's id, the time it must end by, and `ctx.log`,
which writes a log line carrying the call's id.

The runtime answers some requests itself, without the handler or after it:

| When                                                  | It answers |
| ----------------------------------------------------- | ---------- |
| The handler throws, or returns what is not a response | `500`      |
| The call takes longer than the **Timeout**            | `504`      |
| **Concurrency** calls are already running             | `429`      |
| The request's body is larger than the **Body Size**   | `413`      |
| The handler cannot be loaded, such as a syntax error  | `500`      |

The error itself is never sent to the client: it is in the function's logs.

## Libraries

A manifest beside the code installs its libraries when the function is built:

| Runtime | Manifest           | Installed with |
| ------- | ------------------ | -------------- |
| Node.js | `package.json`     | npm            |
| Bun     | `package.json`     | bun            |
| Python  | `requirements.txt` | uv             |
| Go      | `go.mod`           | go             |

Without a lock file, the build makes one; keep it in the code so that every
build installs the same versions. Debian packages, such as `ffmpeg`, go in the
function's settings, under **Debian Packages**.

## Edit and test it

The function's **Code** tab holds its code, when it is written here:

- the file list, on the left: type a path, such as `lib/util.js`, and press
  Enter to add a file; the bin beside a file removes it;
- the editor, for the file chosen;
- **Save & Deploy** saves the code and deploys it; **Discard** drops the
  changes.

The panel beside the editor tries the code as it is in the editor, not yet
saved: choose a method, give a path with its query, such as
`/hello?name=Ada`, headers - one per line, `name: value` - and a body, then
**Run**. It runs once, in a container thrown away after, on a build node, with
the function's env vars and secrets. The answer shows:

- the outcome, the status and how long the call took;
- the response's **Body** and **Headers**;
- the call's **Logs**, and the runtime's **Errors**;
- **Install**, the log of the libraries' install, when they were installed.

A first run after the libraries change installs them, which can take a few
minutes. When the run made a lock file, **Add to the code** adds it to the
editor; **Save & Deploy** then keeps it.

A function built from a repository is edited in its repository: its **Code**
tab says where.

## Settings

The function's **Settings** → **Function**:

| Section              | Field                         | What it is                                                                                              |
| -------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Runtime**          | **Runtime**                   | The runtime. Changing it does not rewrite the code: rewrite it in the **Code** tab.                     |
|                      | **Entrypoint File**           | The handler's file; for Go, its package's directory.                                                    |
|                      | **Handler**                   | The name the file exports the handler by.                                                               |
|                      | **Debian Packages**           | Packages installed into the function's image, such as `ffmpeg` or `libvips=8.14.1-3`.                   |
| **Limits Of A Call** | **Timeout**                   | How long a call may take, from `1s` to `15m`. `30s` by default.                                         |
|                      | **Concurrency**               | How many calls one instance runs at once, 1 to 1000; a call over it is answered `429`. `16` by default. |
|                      | **Body Size**                 | The largest request body a call takes, from `1kb` to `100mb`. `6mb` by default.                         |
| **Code**             |                               | **Written here**, or **From a repository**, with the same fields as when creating it.                   |
| **Image**            | **Registry To Push Image To** | Where the function's image is pushed, for a cluster of several nodes to pull it from.                   |

**Save & Deploy** saves the settings and deploys the function.

## Scale it

A function has more instances by its **Replicas**, in **Settings** →
**Availability & Scaling**: each runs **Concurrency** calls at once.

Or **Autoscale**, on the same page, sets them: every 15 seconds HivePaaS reads
the function's calls and keeps as many instances as they need, between a
minimum and a maximum.

| Field              | What it is                                                                                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Autoscale**      | Off by default.                                                                                                                                                  |
| **Min Replicas**   | The fewest instances it keeps, however quiet: 1 or more. `1` by default.                                                                                         |
| **Max Replicas**   | The most it starts, however busy: up to 50. `5` by default.                                                                                                      |
| **Target**         | How much of an instance's **Concurrency** it keeps busy, 10 to 100 %. `70 %` by default: at a Concurrency of 16, an instance for every 11 calls running at once. |
| **Scale-in Delay** | How long the calls stay low before it scales in, 1 minute to 1 hour. `5 minutes` by default.                                                                     |

- **Out, at once**, when calls are answered `429` because every instance is at
  its Concurrency - by more instances the more calls were turned away - or
  come in a burst: the calls running at once over the last 15 seconds needing
  twice the instances, or more. Otherwise once they have needed more instances
  for 30 seconds, then every 15 seconds while they still do. Each time to twice
  as many at most, or 4 more when that is more.
- **In, slowly**: once the calls have needed fewer for the scale-in delay, by
  half the way down every 15 seconds.
- Turned on, it brings the function within Min and Max at once; turned off, it
  leaves the replicas as they are. While it is on, **Replicas** shows the count
  and only Autoscale changes it; a deployment keeps it. A stopped function
  stays stopped.
- The section lists the latest scalings, with when, from and to how many, and
  why; the **Metrics** tab draws the replicas over the calls.

It counts the calls from the line the runtime logs for each one (see
[Watch it](#watch-it)), so it needs the logs stored: without them it cannot be
turned on, and one already on is paused, and says why. It is paused too for a
function whose **Service Mode** is not **Replicated**.

:::note[What it does not do]

- **Scale to zero**: one instance at least is up, to answer the first call.
- **Answer a burst within seconds**: new instances come in 20 seconds to a
  minute, and calls over the Concurrency are answered `429` until then. For a
  burst you expect, raise **Min Replicas**.
- **See a long call before it ends**: a call is counted when it ends, and for
  a minute at most, so a function whose calls take minutes is better scaled by
  hand.
- **Keep what an instance holds**: an instance it stops loses what it kept in
  memory, so a function that keeps state in its instance should not autoscale.

:::

## Reach it

- **At a domain**: created with **Expose at a domain**, the function is routed
  there over HTTPS from its first deployment. Its domains are changed in its
  **Routing Settings**, as any app's: see
  [App domains](../domains-and-tls/app-domains.md).
- **Inside its project**: the apps of its environment reach it by its name, on
  port `8080`.

## Call it on a schedule

In the function's **Settings** → **Scheduled Jobs**, **New Function Call**
makes a job that calls the function with a request on a schedule: its
**Method**, its **Path** with the query, its **Headers** and its **Body**. A
running instance of the function answers it; a status of `400` or more fails the
run, and the response is the run's output, in the task's details. The app's
**Scheduled Jobs** feature must be on: see
[Scheduled jobs](../configuring-apps/scheduled-jobs.md).

## Watch it

The function's **Metrics** tab, under **Calls**, counts its calls over the last
hour, 6 hours, 24 hours or 7 days: how many, how many failed, how many it answered `5xx`, and how
long its handler took - p50, p95 and p99. They are counted from the line its
runtime logs for every call, so they need the logs stored: see
[Logs, metrics and terminal](../configuring-apps/logs-and-terminal.md).

In its **Logs**, every call is a line:

```json
{
  "hp": "invocation",
  "requestId": "…",
  "method": "GET",
  "path": "/hello",
  "status": 200,
  "durationMs": 12.5,
  "outcome": "ok"
}
```

and every `ctx.log` line carries the call's `requestId`. The path is logged
without its query, so that what a query carries stays out of the logs.

## From an AI assistant

Through the [MCP server](../integrations/mcp-server.md), an assistant can
create a function from code it writes with you, test it with a request, deploy
it, read its calls, schedule it, and turn its autoscale on - each change
planned first, and applied once you agree.
