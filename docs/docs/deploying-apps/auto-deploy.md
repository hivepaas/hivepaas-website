---
sidebar_position: 5
description: 'Deploying on every push, with webhooks or the GitHub App.'
---

# Automatic deployments

An app built from a [Git repository](./git-repository.md) can deploy on every
push. The Git host tells HivePaaS about the push, through the GitHub App or a
webhook, and HivePaaS deploys each app that builds that repository and branch.

## With the GitHub App

For GitHub, a GitHub App gives HivePaaS access to your repositories and their
events in one step.

1. In **Integrations → Github Apps**, provision a GitHub App: give it a name,
   and say whether it belongs to your GitHub user or to an organization.
2. HivePaaS sends you to GitHub, which creates the app for you. Be signed in to
   GitHub first.
3. Install the app on the repositories HivePaaS should see.
4. In each app's **Deployment Settings**, choose the GitHub App under **Git
   Credentials**.

Pushes to those repositories now reach HivePaaS.

## With a webhook

For GitLab, Gitea, Bitbucket and Gogs, or GitHub without the app:

1. In **Integrations → Webhooks**, create a webhook. Choose the Git host under
   **Type**, and leave **Secret** empty to have one generated.
2. Copy its **Webhook URL** and **Secret**.
3. In the repository's settings, or its organization's, add a webhook with that
   URL and secret, for these events:

| Host   | Events                                                               |
| ------ | -------------------------------------------------------------------- |
| GitHub | Pushes, Pull requests, Issue comments                                |
| GitLab | Push events, Merge request events, Comments                          |
| Gitea  | Push, Pull Request, Pull Request Comments, Pull Request Synchronized |

Pushes are enough for automatic deployments. The pull request and comment
events are for [pull request previews](./pr-previews.md).

A webhook can serve many repositories: every one that sends it events.

## What deploys

On a push, HivePaaS deploys every app that:

- builds from **Git Source**,
- from the repository pushed to,
- and the **Branch** pushed to.

There is no switch per app: every app that matches deploys. Its deployment shows
**repo-webhook** as its trigger.

## From CI instead

To deploy from a CI pipeline, after its tests pass, call the API with an API key.
See [CI/CD](../integrations/ci-cd.md).
