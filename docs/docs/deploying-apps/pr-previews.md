---
sidebar_position: 6
description: 'A preview of an app for each pull request.'
---

# Pull request previews

A preview is a copy of an app, deployed from a pull request, on its own domain.
Reviewers try the change before it merges; HivePaaS removes the preview when the
pull request closes.

Previews need an app built from a [Git repository](./git-repository.md), and
the repository's events reaching HivePaaS, through the GitHub App or a webhook
with pull request and comment events. See
[Automatic deployments](./auto-deploy.md).

## What a preview is

A preview of pull request 42 is an app of its own, `pr-42`, made under the app,
in the same environment. It is listed inside the app in the project, and in the
app's **Preview Deployments** tab.

It starts as a copy of the app:

- **Its source** is the pull request: `pull/42` on GitHub and Gitea,
  `merge-requests/42` on GitLab, the pull request's branch on Bitbucket. It is
  built from the newest commit, with the app's build settings.
- **Its container** is a copy of the app's as it is when the preview is made -
  its command, resources and health check - with **one replica**.
- **Its domains** are the app's, prefixed with `pr-42-`: see
  [Its domain](#its-domain).
- **Its env vars** are the app's. A reference to a database app cloned for the
  preview points at the clone instead: see
  [Give it its own database](#give-it-its-own-database).
- **Its secrets and config files** are those of the app's that are
  **Inheritable**. One that is not stays with the app, and a reference to it,
  such as `${secrets.API_KEY}`, comes out empty in the preview.

It does not get the app's scheduled or periodic jobs, nor its setting mounts:
mounting a secret into a container takes a permission no one is there to give
when a comment makes the preview.

## Turn previews on

In the app's **Feature Settings**, under **App Preview**:

| Setting                                    | What it does                                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------------- |
| **Enabled**                                | Allows previews of this app.                                                      |
| **Allow PR Comments**                      | Lets comments on a pull request create and remove its preview. Off by default.    |
| **Preview Creation Delay**                 | Waits this long before creating a preview from a comment.                         |
| **DB Apps to Clone**                       | Database apps to copy for each preview, so it has a database of its own.          |
| **Auto Clone DB Apps on Preview Creation** | Clones them for every preview, without being asked.                               |
| **Commands to Run on Preview Creation**    | Command templates run while a preview is made: see [Run commands](#run-commands). |

## Create a preview from the pull request

With **Allow PR Comments** on, comment on the pull request:

```text
/hivepaas deploy
```

HivePaaS answers in the pull request, and deploys the preview. Options go on the
same line:

```text
/hivepaas deploy [subdomain=<name>] [clonedb|noclonedb] [nowait] [nostart]
```

| Option                  | What it does                                            |
| ----------------------- | ------------------------------------------------------- |
| `subdomain=<name>`      | The preview's prefix, `pr-<number>` by default.         |
| `clonedb` / `noclonedb` | Clones the database apps set to be cloned, or does not. |
| `nowait`                | Skips the **Preview Creation Delay**.                   |
| `nostart`               | Creates the preview without starting it.                |

Commenting `/hivepaas deploy` again deploys the preview again. To remove it
before the pull request closes:

```text
/hivepaas cancel
```

With **Allow PR Comments** off, HivePaaS answers a command with where to turn
it on, and does nothing else. A command it does not understand is answered with
the list of commands.

:::warning[Who can comment can deploy]

A preview runs the pull request's code with the app's env vars and secrets. On
a public repository, anybody can open a pull request and comment on it: leave
**Allow PR Comments** off there, and create previews from the dashboard.

:::

## Create a preview from the dashboard

In the app's **Preview Deployments** tab, **Create a preview** with:

- **Git Ref**: the pull request, such as `pull/123` on GitHub and Gitea, or
  `merge-requests/123` on GitLab - or pick one of the repository's open pull
  requests or branches;
- **Custom Subdomain**, **Clone DB Apps** and **Create Only (Do Not Start)**,
  the same as the comment's options.

This works whatever **Allow PR Comments** says.

## Its domain

A preview answers beside each of the app's domains, its name prefixed: the
preview of pull request 42 of an app at `shop.example.com` is at
`pr-42-shop.example.com`. Beside rather than under, the app's own DNS record and
certificate cover it: a wildcard for `*.example.com` covers both.

| The app's domain       | Its preview's                |
| ---------------------- | ---------------------------- |
| `shop.example.com`     | `pr-42-shop.example.com`     |
| `api.shop.example.com` | `pr-42-api.shop.example.com` |
| `example.com`          | `pr-42.example.com`          |

A domain at the root of its zone, such as `example.com`, has its previews
under it. So does a subdomain asked for with a dot in it, such as
`subdomain=review.pr-42`. The prefixed label is 63 characters at most, as DNS
allows: a longer one stops the preview from being made, and a shorter
`subdomain` fixes it. A domain another app holds already stops it too.

Each preview's domain gets its certificate as any app's does: a wildcard
covering it if HivePaaS has one - the app's own, usually - or one obtained for
it. See [Certificates](../domains-and-tls/certificates.md).

## Give it its own database

A preview that shares the app's database runs its migrations on it, and can
break the app. To give it a database of its own:

1. Set up the database app's **App Clone** settings: how it is copied, data
   included or not.
2. Add it under **DB Apps to Clone**.
3. Clone it for every preview with **Auto Clone DB Apps on Preview Creation**,
   or for one with `clonedb`, or the dashboard's **Clone DB Apps**.

Each preview then gets its own copy of the database app, made before the
preview starts. The preview's env vars that referred to the database, such as
`DATABASE_URL=postgres://${db.HIVEPAAS_USER}@${db.HIVEPAAS_HOST}/...`, refer to
the copy. Several database apps are copied in the order their references to
each other need.

## Run commands

**Commands to Run on Preview Creation** are command templates run while a
preview is made, once its databases are copied and before it is deployed - to
create a database for it, or load test data.

They run in a container of the **app**, not of the preview, which has not
started yet: the app must be running. Beside the app's env vars, they get:

| Variable                       | Holds                               |
| ------------------------------ | ----------------------------------- |
| `HIVEPAAS_PREVIEW_APP_NAME`    | the preview's name, such as `pr-42` |
| `HIVEPAAS_PREVIEW_APP_ID`      | the preview's ID                    |
| `HIVEPAAS_PREVIEW_SUBDOMAIN`   | its prefix, such as `pr-42`         |
| `HIVEPAAS_PREVIEW_REPO_REF`    | the ref it deploys, such as pull/42 |
| `HIVEPAAS_PREVIEW_PULL_NUMBER` | the pull request's number           |
| `HIVEPAAS_PARENT_APP_NAME`     | the app's name                      |
| `HIVEPAAS_PARENT_APP_ID`       | the app's ID                        |

A command that fails - one that exits with a code other than 0 - stops the
preview from being made; a preview for a pull request says so in it.

## While the pull request is open

- **New commits** to the pull request deploy the preview again.
- **Closing or merging** the pull request removes the preview, the database
  apps cloned for it, and their data.
- **Deleting the app** deletes its previews too.

A preview is an app: its logs, deployments and terminal are where any app's
are, and it can be deleted on its own, from its **Danger Zone**.
