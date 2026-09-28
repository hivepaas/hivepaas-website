---
sidebar_position: 2
description: 'From a fresh server to a running app with a domain and TLS.'
---

# Quick start

From a fresh server to your first app, on its own domain with a certificate,
in about fifteen minutes.

You need:

- **A Linux server** with a public IP address, and root access. See the
  [requirements](../installation/requirements.md).
- **A domain** whose DNS you can change, such as `example.com`.

## 1. Point your domain at the server

Add two DNS records, both to the server's public IP address:

| Record                 | For           |
| ---------------------- | ------------- |
| `hivepaas.example.com` | the dashboard |
| `*.example.com`        | your apps     |

## 2. Install HivePaaS

On the server:

```bash
curl -fsSL https://raw.githubusercontent.com/hivepaas/hivepaas/main/deployment/release/install.sh | sudo bash
```

Answer its questions: your email and a password for the admin, and
`hivepaas.example.com` for the app domain. Enter keeps the default of the
others. [Install HivePaaS](../installation/install.md) explains each question.

The installer ends with:

```text
  HivePaaS is running.

  Dashboard   https://hivepaas.example.com
```

## 3. Sign in

Open `https://hivepaas.example.com`, and sign in as `admin`, or with your
email, and the password you chose.

:::tip

If the browser warns about the certificate, Let's Encrypt's has not arrived
yet: it does within a minute or two of DNS pointing at the server. Once it has,
quit and reopen the browser.

:::

## 4. Create a project

A project holds your apps, in environments.

1. Open **Projects**, and click **New Project**.
2. Give it a name, such as `My first project`.
3. Keep its environments, `development` and `production`, and create it.

## 5. Deploy an app from the app store

Deploy [Uptime Kuma](https://uptime.kuma.pet), a monitoring tool, from its
template:

1. In the project, click **New From Template**.
2. Search for **Uptime Kuma**, and click **Deploy Template**.
3. Fill in the form:
   - **App Name**: `uptime-kuma`;
   - **Target Environment**: `production`;
   - **Domain**: `status.example.com`.
4. Click **Deploy Template**.

HivePaaS creates the app and deploys it. The app's **Deployments** tab follows
the deployment; it takes a minute or so, while the image downloads.

## 6. Open it

Open `https://status.example.com`. The wildcard record sends it to the server,
Traefik to the app, and HivePaaS has asked Let's Encrypt for its certificate.

Uptime Kuma asks you to create its own admin account on your first visit.

## Deploy your own image

To deploy an image of your own instead:

1. In the project, click **New App**, give it a name, and choose its environment.
2. In the app's **Routing Settings**, set the **Container Port** your image
   listens on, and add a domain, such as `hello.example.com`.
3. In its **Deployment Settings**, choose an image, such as `nginx:alpine`, and
   click **Deploy**.

## Next

- [Core concepts](./concepts.md): how projects, environments, apps and settings fit together.
- [Deploying apps](../category/deploying-apps): from Git, with automatic
  deployments and pull request previews.
- [First setup](../installation/first-setup.md): the settings to make before
  your team joins.
