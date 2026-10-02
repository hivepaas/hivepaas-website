---
sidebar_position: 1
description: 'Deploying an image from Docker Hub or a private registry.'
---

# From a Docker image

The quickest way to run an app you already have as an image, on Docker Hub, GitHub
Container Registry or any other registry.

## 1. Create the app

In the project, click **New App**, give it a name, and choose its environment.

## 2. Route it

For an app that serves HTTP, open the app's **Routing Settings**:

- turn on **Expose The App To The Internet**;
- set the **Container Port**, the port the image listens on, such as `80`;
- add a domain under **Domains**, such as `hello.example.com`;
- save.

An app that serves nothing over HTTP, such as a worker or a database, skips this
step: the apps of its environment still reach it by its key.

## 3. Deploy it

Open the app's **Deployment Settings**:

1. For **Method**, choose **Docker Image**.
2. In **Docker Image**, give the image and its tag, such as `nginx:1.27-alpine`
   or `ghcr.io/acme/web:2.4.0`.
3. For a private image, choose its **Registry Credentials**.
4. Click **Deploy**.

HivePaaS pulls the image and starts the app. The app's **Deployments** tab
follows the deployment and shows its logs; see [Deployments](./deployments.md).

## Private registries

A private image needs the registry's credentials. Add them once, in
**Integrations → Registry Auth**, globally or in the project, and choose them
under **Registry Credentials**.

A credential is a server address, a username and a password, used as they are.
Choose one that does not expire:

| Registry                  | Username                     | Password                                                                                                                    |
| ------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Docker Hub                | your Docker Hub username     | an access token, read-only for pulling                                                                                      |
| GitHub Container Registry | your GitHub username         | a personal access token with `read:packages`                                                                                |
| Google Artifact Registry  | `_json_key_base64`           | a service account's JSON key, in base64 (`base64 -w0 key.json` on Linux). Its address is like `europe-west1-docker.pkg.dev` |
| Azure Container Registry  | a service principal's app ID | its secret - or the registry's admin user and password                                                                      |

A short-lived token - Google's `oauth2accesstoken`, an Azure AD token, or
Amazon ECR's `aws ecr get-login-password`, which lasts 12 hours - works until it
expires, then pulls fail: Swarm keeps the credential an app was deployed with,
and uses it again to start the app on another node.

## Run options

Deployment Settings also set how the container runs:

| Setting                     | What it does                                                                              |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| **Command**                 | Runs this instead of the image's own command.                                             |
| **Working Directory**       | The directory the command runs in.                                                        |
| **Pre-deployment Command**  | Runs in a container of the version still running, before the app is updated.              |
| **Post-deployment Command** | Runs in a container of the new version, once it is running, such as `make db-migrate-up`. |

A pre- or post-deployment command that fails fails the deployment.

## Updating

To run a new version, change the tag in **Docker Image**, and click **Deploy**.

Every deployment pulls the image again, so a tag that moves, such as `latest`,
gets its newest build on each deployment. A fixed tag, such as `2.4.0`, makes
each deployment repeatable, and going back to a version is deploying its tag
again.
