---
sidebar_position: 7
description: 'Moving a license to a swarm made again or a new server: in the portal, 10 times in any 365 days.'
---

# Moving a license

A key names the installation it is for by its swarm's ID. A swarm made again,
as in a disaster recovery, or HivePaaS installed on a new server, has a new ID,
and the key for the old one is refused there:
`This license key is for another installation. This installation's ID is …`.
Move the license to the new ID in the portal, and paste the key it issues.

The key is not in an [export](../administration/export-and-import.md): a new
installation starts on Bee, and an import that would take it past Bee's limits
is refused. Move the license, and install its key, before you import.

## Move it

1. Copy the new installation's ID from its **System → License**.
2. In the portal's **Licenses**, click **Move** on the license.
3. Give the **New installation ID**, and click **Move**.
4. The portal issues a key for the new installation, with the same end date. It
   shows it, emails it, and keeps it under **Licenses**.
5. Paste it into the new installation's **System → License**: see
   [Install a license key](./install-a-license-key.md#paste-it).

Moving it back later works the same way, and counts as a move.

## What can move

- **10 moves in any 365 days.** The **Move** dialog says how many are used, and
  when the next one is free once they all are. Past that, support moves it: see
  [Getting help](../troubleshooting/getting-help.md#licenses-and-billing).
- **An active license whose key is in force**: not one run out, canceled or
  paused.
- **Not a trial.** A trial stays with the installation it was started for.
- **Not an Apiary license**, or another issued by hand: support moves those.
- **Not onto an installation that already has a paid license in force.** A
  trial there gives way to the license moved onto it.

## The installation it leaves

The key the old installation holds is superseded, and no renewal follows it.

- **Online**, the old installation learns of the move at its next daily check:
  its status turns **Moved**, and a banner says
  `This license key now belongs to another installation.` It keeps its plan for
  the key's grace counted from the move, 30 days, but not past the end of the
  key's own grace, then it is on Bee.
- **Offline**, it keeps the old key until the key runs out, with its grace.

Either way, nothing that runs there is stopped: see
[Grace, expiry and limits](./grace-expiry-and-limits.md).
