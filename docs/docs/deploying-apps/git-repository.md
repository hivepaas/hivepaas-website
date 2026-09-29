---
sidebar_position: 2
description: 'Building an app from its source, and deploying it.'
---

# From a Git repository

HivePaaS can build an image from your source, then deploy it. It builds from a
Dockerfile in the repository, one you write in the dashboard, or one it
generates for your language or framework.

## 1. Connect the repository

A public repository needs nothing. A private one needs credentials, added once
in **Integrations**, globally or in the project:

| Credentials                                | For                                                                                                                                                |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GitHub App** (Sources → Github Apps)     | GitHub. The simplest: it gives access to the repositories you install it on, and sends their events for [automatic deployments](./auto-deploy.md). |
| **Access token** (Access & Authentication) | GitHub, GitLab, Gitea, Bitbucket and Gogs: a token of the account that can read the repository.                                                    |
| **SSH key** (Access & Authentication)      | Any Git host: a key added to the repository or its account as a deploy key.                                                                        |

## 2. Set the source

Create the app with **New App**, route it as for
[an image](./docker-image.md#2-route-it), then open its **Deployment Settings**
and choose **Git Source** for **Method**:

| Setting                | What to give                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Git Credentials**    | The credentials above, or none for a public repository.                                                      |
| **Git Repository**     | The repository's URL, such as `https://github.com/acme/shop.git`. With credentials, you can pick it instead. |
| **Branch**             | The branch to build, such as `main`, or a tag, such as `tags/v1.2.3`.                                        |
| **Commit Hash**        | Optional: a commit to build instead of the branch's latest.                                                  |
| **Repository Options** | Git submodules and Git LFS, when the repository uses them.                                                   |

## 3. Choose how it is built

Under **Dockerfile Source**:

- **Manual**: the repository's Dockerfile, at **Dockerfile Path**, `Dockerfile`
  by default. To use one that is not in the repository, write it in
  **Dockerfile Content**; **Load Template** starts it from a template for your
  language.
- **Auto-Generate**: HivePaaS reads the source, recognizes what it is, and writes
  a Dockerfile for it. **Dockerfile Gen Scan Path** is the directory to read,
  for a repository whose app is not at its root.

Auto-Generate recognizes Go, Ruby, Python, PHP, Elixir, Java, Rust, Next.js,
Bun, Deno, Node.js, .NET, Dart, C and C++, Zig, Scala, Astro, Nuxt, R, and static
sites. The deployment's logs show the Dockerfile it wrote.

## 4. Deploy

Click **Deploy**. The deployment checks out the source, builds the image, and
starts the app; its logs show each step.

### Build-time env vars

A build that needs env vars, such as an API URL compiled into a frontend, takes
them from the app's **Env Variables**, under **Build Time Env Variables**. A
generated Dockerfile also reads some of its options from them: the deployment's
logs say so.

## More than one node

An image HivePaaS builds stays on the node that built it. With more than one
node, choose a registry under **Registry To Push Image To**, and give its
**Image Repository**: HivePaaS pushes each build there, so every node can pull
it. Create the repository in the registry first.

With a single node, nothing needs pushing.

## Build settings

**Settings → Image Build** sets how every build runs: which nodes build, how many
builds run at once, the CPU and memory a build may use, and whether builds use
Docker's cache. **Settings → Data Cleanup → Force Clear Build Cache** clears the
build cache when it has grown.
