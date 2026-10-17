---
sidebar_position: 5
description: 'Configuration specs: moving an installation, a project, an environment or an app.'
---

# Export and import

An export writes HivePaaS's configuration into a bundle: its projects, apps and
settings. An import reads a bundle into another installation, or back into this
one. Moving to a new server, copying a project, keeping configuration in Git.

A bundle carries configuration, not data: the files on apps' storage and their
databases' contents travel through [backups](../backups/app-backups.md).

## Export

In **Operations → Export**, choose what to export: the whole installation, or
some of its projects, environments and apps. A project's own **Export** exports
it alone.

Then choose what happens to secrets:

| Secrets                    | The bundle                                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Exclude secrets**        | Has every secret emptied: safe to share or commit. The keys stay, to show what needs filling in.     |
| **Include, encrypted**     | Carries the secrets, and is encrypted with a passphrase you choose, with the standard `age` tool.    |
| **Include, in plain text** | Carries the secrets readable by anyone. Only for moving an installation, where you control the file. |

The bundle downloads as a `.tar.gz` file, or `.tar.gz.age` when encrypted.
HivePaaS keeps no copy of the passphrase: without it, the bundle cannot be opened.

## Import

In **Operations → Export**, under **Import**, choose the bundle, and its
passphrase if it has one. HivePaaS reads it and shows **What the import would
do**, before changing anything: what it creates, what it updates, what it leaves
out and why.

Then choose:

- **What exists here**: **Leave it as it is**, and only create what is missing,
  or **Make it match the bundle**. Apps whose configuration changes restart.
- **Deploy the apps it creates**, and **Deploy the apps whose source changes**.
  Otherwise, a new app starts on a placeholder image, and a changed one keeps
  its current image until someone deploys it.

The apps and functions an import creates count towards the plan's limits, and
so do the Google, Microsoft and OpenID Connect sign-in providers it enables. An
import that would go past one is refused whole, before anything changes. A
bundle never carries the license key: install it on a new installation before
importing. See [Plans and limits](../plans-and-licenses/plans-and-limits.md).

## What a bundle leaves out

- Settings that cannot be made again from a file.
- Pull request previews, which belong to their pull requests.
- Anything the bundle refers to that the installation lacks: the import asks
  for it.
