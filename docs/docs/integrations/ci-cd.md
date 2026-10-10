---
sidebar_position: 2
description: 'Deploying, restarting and running jobs from CI, with the hivepaas CLI or the REST API.'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# CI/CD

A CI pipeline drives HivePaaS with the [CLI](../cli/index.md), or through its
[REST API](./rest-api.md) with `curl`: deploy once the tests pass, build the
image in CI and deploy it, restart an app, run a job.

Each step below shows both. The CLI does each in one command, names the app by
its name, and waits for the result; `curl` and `jq` need nothing installed.
Pick a tab: the page keeps your choice. The examples are GitHub Actions
workflows, and the same commands work in any CI.

## Before you start

### An API key

In the dashboard, **Your Account → API Keys**, create a key for CI. Give it only
what the pipeline does, on the **Project** module:

| The pipeline                                       | The key needs |
| -------------------------------------------------- | ------------- |
| reads settings, and waits for deployments and jobs | **Read**      |
| changes deployment settings                        | **Write**     |
| deploys, restarts, stops, starts, runs jobs        | **Execute**   |

<Tabs groupId="ci-client">
<TabItem value="cli" label="CLI" default>

Keep it in the CI's secrets as one value, `<key id>:<secret>`, such as
`HIVEPAAS_API_KEY` in GitHub. The CLI reads it from the environment, with
`HIVEPAAS_URL`, the installation's address; nothing is stored.

</TabItem>
<TabItem value="curl" label="curl">

Keep its ID and secret in the CI's secrets, such as `HIVEPAAS_API_KEY_ID` and
`HIVEPAAS_API_SECRET_KEY` in GitHub.

</TabItem>
</Tabs>

### The app

<Tabs groupId="ci-client">
<TabItem value="cli" label="CLI" default>

A command names the app by its project, environment and app:
`-p shop -e production -a api`. A project and an app go by their name, key or
ID, an environment by its name, and a scheduled job or a registry account by
its name or ID.

</TabItem>
<TabItem value="curl" label="curl">

**Copy ID**, in the actions menu of each list, copies what the API takes:

- the project's ID, from **Projects**;
- the app's ID, from the project's apps;
- a scheduled job's ID, from the app's **Scheduled Jobs**.

The environment is its name, such as `production`.

</TabItem>
</Tabs>

### Setting up the job

<Tabs groupId="ci-client">
<TabItem value="cli" label="CLI" default>

Install the CLI in the job, its version pinned and its archive checked, and
give it the installation and the key:

```yaml
env:
  HIVEPAAS_URL: https://hivepaas.example.com
  HIVEPAAS_API_KEY: ${{ secrets.HIVEPAAS_API_KEY }}

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
```

Move the version when you update the installation. See
[In CI](../cli/ci.md).

</TabItem>
<TabItem value="curl" label="curl">

The examples use this helper and these variables:

```bash
HIVEPAAS_URL="https://hivepaas.example.com/api"
APP_URL="$HIVEPAAS_URL/projects/$PROJECT_ID/$ENV/apps/$APP_ID"

# hp calls the API with the key, and fails on an error, printing it.
hp() {
  curl -sS --fail-with-body \
    -H "HIVEPAAS-API-KEY-ID: $HIVEPAAS_API_KEY_ID" \
    -H "HIVEPAAS-API-SECRET-KEY: $HIVEPAAS_API_SECRET_KEY" \
    -H "Content-Type: application/json" \
    "$@"
}
```

</TabItem>
</Tabs>

## Deploying

There are two ways to deploy, for two kinds of pipeline.

### Deploy the app as it is set up

For an app built from a [Git repository](../deploying-apps/git-repository.md),
or one on an image tag that moves, such as `latest`: deploy it again, as it is
set up.

<Tabs groupId="ci-client">
<TabItem value="cli" label="CLI" default>

```bash
hivepaas deploy -p shop -e production -a api --change-id "$GITHUB_SHA"
```

- **`--no-cache`** builds the image without Docker's cache, for a build that
  keeps an outdated layer. It applies to apps built from Git.
- **`--change-id`**: optional, a name for the change the deployment is for, such
  as the commit. It is kept with the deployment.

</TabItem>
<TabItem value="curl" label="curl">

```bash
DEPLOYMENT_ID=$(hp -X POST "$APP_URL/deploy" \
  -d '{"noCache": false, "changeId": "'"$GITHUB_SHA"'"}' | jq -r '.data.deploymentId')
```

- **`noCache`**: `true` builds the image without Docker's cache, for a build
  that keeps an outdated layer. It applies to apps built from Git.
- **`changeId`**: optional, a name for the change the deployment is for, such as
  the commit. It is kept with the deployment.

</TabItem>
</Tabs>

### Change the deployment settings, and deploy

To deploy something new, such as the image CI just built, change the app's
**Deployment Settings**. Saving them deploys the app, as the dashboard's
**Deploy** button does.

<Tabs groupId="ci-client">
<TabItem value="cli" label="CLI" default>

```bash
hivepaas deploy -p shop -e production -a api --image "ghcr.io/acme/shop:$GITHUB_SHA"
```

For an app built from Git, set a commit to build instead:

```bash
hivepaas deploy -p shop -e production -a api --commit "$GITHUB_SHA"
```

The flags change the settings in one write, which deploys them; the rest of the
settings stay as they are. `--no-cache` and `--change-id` do not go with a
change of the settings.

</TabItem>
<TabItem value="curl" label="curl">

The settings are read, changed, and written back whole. The `updateVer` they are
read with makes the write fail if someone changed them in between, rather than
overwrite their change.

```bash
IMAGE="ghcr.io/acme/shop:$GITHUB_SHA"

SETTINGS=$(hp "$APP_URL/deployment-settings" | jq --arg image "$IMAGE" '
  .data
  | .activeMethod = "image"
  | .imageSource = { image: $image, registryAuth: (.imageSource.registryAuth // {}) }')

DEPLOYMENT_ID=$(hp -X PUT "$APP_URL/deployment-settings" -d "$SETTINGS" \
  | jq -r '.data.deploymentId')
```

For an app built from Git, set a commit to build instead:

```bash
SETTINGS=$(hp "$APP_URL/deployment-settings" | jq --arg sha "$GITHUB_SHA" '
  .data | .repoSource.commitHash = $sha')
```

</TabItem>
</Tabs>

## Waiting for a deployment to finish

A deployment runs on its own. To fail the pipeline when the deployment fails,
wait for it.

<Tabs groupId="ci-client">
<TabItem value="cli" label="CLI" default>

`hivepaas deploy` waits for the deployment, following its logs. It fails the
step when the deployment fails, with exit code 8, or when it is still running
after 30 minutes, with exit code 9: `--timeout 45m` waits longer, and
`--no-wait` returns as it starts.

</TabItem>
<TabItem value="curl" label="curl">

The call returns as the deployment starts. Wait for it:

```bash
# wait_deployment waits up to 30 minutes, and fails unless the deployment is done.
wait_deployment() {
  local status
  for _ in $(seq 180); do
    status=$(hp "$APP_URL/deployments/$1/status" | jq -r '.data.status')
    case "$status" in
      done) echo "Deployment $1 is done."; return 0 ;;
      failed | canceled) echo "Deployment $1 is $status." >&2; return 1 ;;
    esac
    sleep 10
  done
  echo "Deployment $1 is still $status after 30 minutes." >&2
  return 1
}

wait_deployment "$DEPLOYMENT_ID"
```

A deployment is `not-started`, `in-progress`, `done`, `failed` or `canceled`.

</TabItem>
</Tabs>

A deployment's logs are in the app's **Deployments** tab.

## Building in CI, into HivePaaS's registry

CI can build the image, push it to [HivePaaS's own registry](../administration/system-settings.md#registry),
and deploy it: builds run on CI's machines, not your servers.

You need:

- the registry turned on, in **System → Registry**, at a domain such as
  `registry.example.com`;
- its account, in **Integrations → Registry Auth**: its username and its
  password, kept in the CI's secrets, and its name - or, for `curl`, its ID,
  which **Copy ID** copies.

Name the image as HivePaaS names its own builds, so the registry's cleanup keeps
the newest of each environment and removes the rest:
`<registry>/<username>/<repository>:<tag prefix>-<commit>`. The app's deployment
settings give the repository and the tag prefix.

<Tabs groupId="ci-client">
<TabItem value="cli" label="CLI" default>

```yaml title=".github/workflows/deploy.yml"
name: Build and deploy

on:
  push:
    branches: [main]

env:
  HIVEPAAS_URL: https://hivepaas.example.com
  HIVEPAAS_API_KEY: ${{ secrets.HIVEPAAS_API_KEY }}
  REGISTRY: registry.example.com

jobs:
  build-and-deploy:
    runs-on: ubuntu-24.04
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Install the HivePaaS CLI
        run: |
          v=1.0.0-beta1
          base=https://github.com/hivepaas/hivepaas-cli/releases/download/v$v
          curl -fsSLO "$base/hivepaas_${v}_linux_amd64.tar.gz"
          curl -fsSLO "$base/checksums.txt"
          sha256sum -c --ignore-missing checksums.txt
          tar xzf "hivepaas_${v}_linux_amd64.tar.gz" hivepaas
          sudo mv hivepaas /usr/local/bin/

      - name: Name the image
        run: |
          NAMING=$(hivepaas deploy settings -p shop -e production -a api -o json \
            | jq -r '.image | "\(.repoName) \(.tagPrefix)"')
          read -r REPO PREFIX <<< "$NAMING"
          echo "IMAGE=$REGISTRY/${{ secrets.HIVEPAAS_REGISTRY_USERNAME }}/$REPO:$PREFIX-${GITHUB_SHA::7}" >> "$GITHUB_ENV"

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v4

      - name: Log in to HivePaaS's registry
        uses: docker/login-action@v4
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ secrets.HIVEPAAS_REGISTRY_USERNAME }}
          password: ${{ secrets.HIVEPAAS_REGISTRY_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v7
        with:
          push: true
          tags: ${{ env.IMAGE }}

      - name: Deploy, and wait for it
        run: |
          hivepaas deploy -p shop -e production -a api \
            --image "$IMAGE" --registry-auth "${{ vars.HIVEPAAS_REGISTRY_AUTH }}"
```

`HIVEPAAS_REGISTRY_AUTH` is the registry account's name in **Registry Auth**.

</TabItem>
<TabItem value="curl" label="curl">

```yaml title=".github/workflows/deploy.yml"
name: Build and deploy

on:
  push:
    branches: [main]

env:
  HIVEPAAS_URL: https://hivepaas.example.com/api
  PROJECT_ID: ${{ vars.HIVEPAAS_PROJECT_ID }}
  ENV: production
  APP_ID: ${{ vars.HIVEPAAS_APP_ID }}
  REGISTRY: registry.example.com

jobs:
  build-and-deploy:
    runs-on: ubuntu-24.04
    env:
      HIVEPAAS_API_KEY_ID: ${{ secrets.HIVEPAAS_API_KEY_ID }}
      HIVEPAAS_API_SECRET_KEY: ${{ secrets.HIVEPAAS_API_SECRET_KEY }}
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Name the image
        run: |
          APP_URL="$HIVEPAAS_URL/projects/$PROJECT_ID/$ENV/apps/$APP_ID"
          NAMING=$(curl -sS --fail-with-body \
            -H "HIVEPAAS-API-KEY-ID: $HIVEPAAS_API_KEY_ID" \
            -H "HIVEPAAS-API-SECRET-KEY: $HIVEPAAS_API_SECRET_KEY" \
            "$APP_URL/deployment-settings" | jq -r '.data.image | "\(.repoName) \(.tagPrefix)"')
          read -r REPO PREFIX <<< "$NAMING"
          echo "IMAGE=$REGISTRY/${{ secrets.HIVEPAAS_REGISTRY_USERNAME }}/$REPO:$PREFIX-${GITHUB_SHA::7}" >> "$GITHUB_ENV"

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v4

      - name: Log in to HivePaaS's registry
        uses: docker/login-action@v4
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ secrets.HIVEPAAS_REGISTRY_USERNAME }}
          password: ${{ secrets.HIVEPAAS_REGISTRY_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v7
        with:
          push: true
          tags: ${{ env.IMAGE }}

      - name: Deploy, and wait for it
        env:
          REGISTRY_AUTH_ID: ${{ vars.HIVEPAAS_REGISTRY_AUTH_ID }}
        run: |
          APP_URL="$HIVEPAAS_URL/projects/$PROJECT_ID/$ENV/apps/$APP_ID"
          hp() {
            curl -sS --fail-with-body \
              -H "HIVEPAAS-API-KEY-ID: $HIVEPAAS_API_KEY_ID" \
              -H "HIVEPAAS-API-SECRET-KEY: $HIVEPAAS_API_SECRET_KEY" \
              -H "Content-Type: application/json" "$@"
          }

          SETTINGS=$(hp "$APP_URL/deployment-settings" | jq --arg image "$IMAGE" --arg auth "$REGISTRY_AUTH_ID" '
            .data
            | .activeMethod = "image"
            | .imageSource = { image: $image, registryAuth: { id: $auth } }')
          DEPLOYMENT_ID=$(hp -X PUT "$APP_URL/deployment-settings" -d "$SETTINGS" | jq -r '.data.deploymentId')
          echo "Deployment $DEPLOYMENT_ID started."

          for _ in $(seq 180); do
            STATUS=$(hp "$APP_URL/deployments/$DEPLOYMENT_ID/status" | jq -r '.data.status')
            case "$STATUS" in
              done) echo "Deployed $IMAGE."; exit 0 ;;
              failed | canceled) echo "The deployment is $STATUS: see the app's Deployments tab." >&2; exit 1 ;;
            esac
            sleep 10
          done
          echo "The deployment is still $STATUS after 30 minutes." >&2
          exit 1
```

</TabItem>
</Tabs>

The app's image then comes from the registry with its account, on every node.

## Restarting, stopping and starting an app

<Tabs groupId="ci-client">
<TabItem value="cli" label="CLI" default>

```bash
# Restart the app's containers, as they are.
hivepaas restart -p shop -e production -a api

# Stop the app, and start it again.
hivepaas app stop -p shop -e production -a api
hivepaas app start -p shop -e production -a api
```

</TabItem>
<TabItem value="curl" label="curl">

```bash
# Restart the app's containers, as they are.
hp -X POST "$APP_URL/restart" -d '{}'

# Stop the app, and start it again.
hp -X POST "$APP_URL/running-status" -d '{"running": false}'
hp -X POST "$APP_URL/running-status" -d '{"running": true}'
```

</TabItem>
</Tabs>

A restart replaces the app's containers with the same image and settings: for an
app that read its configuration at startup, or that is stuck.

## Running a scheduled job

A [scheduled job](../configuring-apps/scheduled-jobs.md) runs from CI as it runs
from the dashboard's **Run Now**: a database backup before a risky deployment, or
a job that loads fixtures into a staging app.

<Tabs groupId="ci-client">
<TabItem value="cli" label="CLI" default>

```bash
hivepaas job run backup -p shop -e production -a api
```

It waits for the run, following its logs, and fails when the run fails, with
exit code 8.

</TabItem>
<TabItem value="curl" label="curl">

```bash
TASK_ID=$(hp -X POST "$APP_URL/sched-jobs/$JOB_ID/exec" -d '{}' | jq -r '.data.task.id')

# Wait for it, as for a deployment.
for _ in $(seq 180); do
  STATUS=$(hp "$APP_URL/tasks/$TASK_ID/status" | jq -r '.data.status')
  case "$STATUS" in
    done) echo "The job is done."; break ;;
    failed | canceled) echo "The job is $STATUS." >&2; exit 1 ;;
  esac
  sleep 10
done
```

</TabItem>
</Tabs>

The run's logs are in the app's **Tasks**. A job of an app whose scheduled jobs
are turned off in its **Feature Settings** is refused.

## More

Every command of the CLI and its flags are in [Commands](../cli/commands/index.md).
Every endpoint, its parameters and its answers are in the
[API reference](/api/hivepaas-api).
