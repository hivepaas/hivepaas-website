---
sidebar_position: 2
description: "Files mounted into an app's containers."
---

# Config files

Some apps read their configuration from a file: an `nginx.conf`, a
`settings.yaml`, a certificate. HivePaaS keeps such files, and mounts them into
the app's containers.

## Create a config file

In the app's **Config Files**, create one with:

- **Name**, such as `nginx-conf`;
- **Value Type**: **Text**, or **Binary** for a file uploaded as it is;
- **Value**, the content, up to 1 MB;
- **Available in Previews**, for the app's pull request previews to get it too.

A project's **Config Files** serve all its apps.

## Setting mounts

A **setting mount** puts files into the app's containers, from a config file, a
secret, or another setting, such as a certificate and its key, or basic auth
users as an `htpasswd` file.

In the app's **Setting Mounts**, create one:

1. **Name** it, such as `tls-files`.
2. Under **Mount From**, choose the kind of setting, then the **Setting** itself.
3. Under **Files**, put each part of the setting at a path in the container,
   such as `/etc/nginx/nginx.conf`, with its owner and mode if the app needs
   them, such as `0400`.

The files follow the setting: when it changes, such as a certificate that is
renewed, the app's containers get the new files.

:::note

Mounting a secret, or a part of a setting stored as a secret, reveals it to
whoever runs the app. It needs the **Can Reveal Secrets** permission.

:::

## Changing a file

Edit the config file. HivePaaS brings the files up to date in every app that
mounts it, on its own: there is nothing to deploy.
