---
sidebar_position: 6
description: 'A preview of an app for each pull request.'
---

# Pull request previews

A preview is a copy of an app, deployed from a pull request's branch, on its
own domain. Reviewers try the change before it merges; HivePaaS removes the
preview when the pull request closes.

Previews need an app built from a [Git repository](./git-repository.md), and
the repository's events reaching HivePaaS, through the GitHub App or a webhook
with pull request and comment events. See
[Automatic deployments](./auto-deploy.md).

## Turn previews on

In the app's **Feature Settings**, under **App Preview**:

| Setting                                    | What it does                                                                     |
| ------------------------------------------ | -------------------------------------------------------------------------------- |
| **Enabled**                                | Allows previews of this app.                                                     |
| **Preview Creation Delay**                 | Waits this long before creating a preview.                                       |
| **DB Apps to Clone**                       | Database apps to copy for each preview, so it has a database of its own.         |
| **Auto Clone DB Apps on Preview Creation** | Clones them for every preview, without being asked.                              |
| **Commands to Run on Preview Creation**    | Command templates to run once the preview is created, such as loading test data. |

:::warning[Give previews their own database]

A preview that shares the app's database runs its migrations on it, and can
break the app. Add the database apps under **DB Apps to Clone**; each needs its
clone settings set up first, in its **App Clone**.

:::

## Create a preview from the pull request

Comment on the pull request:

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
| `subdomain=<name>`      | The preview's subdomain, `pr-<number>` by default.      |
| `clonedb` / `noclonedb` | Clones the database apps set to be cloned, or does not. |
| `nowait`                | Skips the **Preview Creation Delay**.                   |
| `nostart`               | Creates the preview without starting it.                |

To remove the preview before the pull request closes:

```text
/hivepaas cancel
```

## Create a preview from the dashboard

In the app's **Preview Deployments** tab, **Create a preview** with:

- **Git Ref**: the pull request, such as `pull/123` on GitHub and Gitea, or
  `merge-requests/123` on GitLab;
- **Custom Subdomain**, **Clone DB Apps** and **Create Only (Do Not Start)**,
  the same as the comment's options.

## Its domain

A preview answers at its subdomain of each of the app's domains: the preview of
pull request 42 of an app at `shop.example.com` is at `pr-42.shop.example.com`.

A wildcard record for the root domain, `*.example.com`, does not cover these:
add one for the app's domain, `*.shop.example.com`, pointing at your servers.

## While the pull request is open

- **New commits** to the pull request deploy the preview again.
- **Closing or merging** the pull request removes the preview, and the database
  apps cloned for it.
