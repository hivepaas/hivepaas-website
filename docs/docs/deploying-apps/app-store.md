---
sidebar_position: 3
description: 'Deploying ready-made apps and databases from templates.'
---

# From the app store

The app store has hundreds of templates: databases, CMSs, analytics, AI tools,
monitoring, media servers, and more. A template knows how to run its app: the
image, the storage, the health check, the settings, and the other apps it needs.

## Find a template

In a project, open **App Templates**, or click **New From Template** among its
apps. Search by name or tag, or browse by category.

A template's page shows:

- what it creates: its components, and the apps it depends on, such as a database;
- its **parameters**, which are required, and their defaults;
- its versions;
- what it needs: **Needs elevated privileges** for a template that runs with
  more access to its node, **Starts containers of its own** for one that manages
  Docker containers itself.

A template marked **Requires Newer HivePaaS** needs an update of HivePaaS first.

## Deploy it

Choose the version, and click **Deploy Template**. Then fill in:

- **App Name**, the name of the app to create;
- **Target Environment**, the project environment it goes in;
- the template's parameters. A password can be generated with the button beside
  it, and a domain suggested from your root domain.

Click **Deploy Template**.

## What it creates

HivePaaS creates the app, and with it:

- the apps it depends on, such as a database, named after it, such as
  `wiki-db`;
- the components of a template made of several services, such as a frontend
  and a backend.

It deploys them all at once, the dependencies first. Each is an ordinary app:
its settings, logs and deployments are on its page, and its settings can be
changed like any other app's.

## After deploying

- **The app's own setup:** some apps create their admin account on your first
  visit, some print a password in their logs. A template's description says
  how to sign in.
- **A domain later:** a template's domain is optional. Add one any time in the
  app's **Routing Settings**.
