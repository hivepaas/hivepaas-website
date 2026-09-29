---
sidebar_position: 7
description: 'What a deployment does, following one, and going back.'
---

# Deployments and rollbacks

A deployment puts an app's source and settings into effect. Each one is kept,
with its logs, in the app's **Deployments** tab.

## What starts one

| Trigger          | When                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **user**         | **Deploy** in Deployment Settings, or **Re-deploy** on the app's page.                    |
| **repo-webhook** | A push to the app's repository and branch: see [Automatic deployments](./auto-deploy.md). |
| **api**          | A call to the API, from a script, CI, or the app store creating an app.                   |

**Re-deploy**, at the top of the app's page, deploys the app again as it is set
up: it picks up changed env vars and settings.

## What happens

For an image:

1. Pull the image.
2. Run the **Pre-deployment Command**, if any, in the version still running.
3. Update the app's service to the new version.
4. Run the **Post-deployment Command**, if any, in the new version.

For a Git repository, the same, after:

1. Check out the source.
2. Build the image, and push it to a registry when one is set.

A step that fails ends the deployment as **Failed**. Up to step 3, the app keeps
running the version it had; a post-deployment command that fails leaves the new
version running.

## Following one

The **Deployments** tab lists every deployment, with its status:

| Status          | Means                              |
| --------------- | ---------------------------------- |
| **Not Started** | Waiting for its turn.              |
| **In-Progress** | Running; its logs are live.        |
| **Done**        | The app runs the new version.      |
| **Failed**      | A step failed; its logs say which. |
| **Canceled**    | Canceled before it finished.       |

A deployment's details show its method, trigger, image or commit, author and
duration; its logs show each step's output, the build's included.

**Cancel deployment** stops one that has not finished.

## Notifications

In **Deployment Settings**, choose a notification target for deployments that
succeed and for those that fail, or use the default ones. See
[Notifications](../notifications/notification-targets.md).

## Going back

There is no rollback button: going back is deploying the earlier version again.

- **From an image:** set the earlier tag in **Docker Image**, and **Deploy**.
- **From a repository:** set the earlier commit in **Commit Hash**, and
  **Deploy**. Clear it afterwards, to build the branch again.

The **Deployments** tab has the image or commit of every deployment.
