---
sidebar_position: 9
description: 'Finding the known vulnerabilities in the images your apps run, and setting aside those that do not apply.'
---

# Image scanning

HivePaaS can scan the images your apps run for known vulnerabilities, with
[Trivy](https://trivy.dev). It finds what each image carries - the OS packages
and the libraries of your code - and says which have a fixed version, the ones
a rebuild or an update of the image takes away. It blocks nothing: a deployment
goes ahead whatever a scan finds.

An administrator switches it on in **System → Image Scanning** (see
[Switching it on](#switching-it-on)).

## When an image is scanned

- **After each deployment** that ended done, in the background. It never delays
  or fails the deployment.
- **Every day**, at 02:00 by default: the vulnerability database learns of new
  vulnerabilities in images that have not changed.
- **When asked**, with **Scan now** on the app's **Security** tab.

An image scanned within the hour is not scanned again after a deployment or by
the daily scan; **Scan now** always scans.

What is scanned is the image each of the app's running tasks runs. An app with
no running task keeps what it ran last, and says why it was not scanned again.
HivePaaS's own images are scanned by the daily scan: see
[HivePaaS's own images](#hivepaass-own-images).

## The Security tab

The app's **Security** tab shows:

- the image, its platform and its OS - with a warning when the OS is past its
  support, as its packages get no more fixes - and whether the last scan read it
  from its registry (see [Where scans run](#where-scans-run));
- how many vulnerabilities of each severity it carries, and how many have a fix;
- the vulnerabilities, the worst first: the package, the version installed and
  the version that fixes it. **Fixable only** is on by default;
- **Ignored**: those set aside, with why, by whom and until when.

The app's header shows a red badge with the number of fixable **CRITICAL**
vulnerabilities, or an amber one for fixable **HIGH** ones when there is no
CRITICAL. **Home → Needs attention** lists every app with a fixable CRITICAL
vulnerability.

### An image's SBOM

**Download SBOM** on an image lists the packages it carries as a
[CycloneDX](https://cyclonedx.org) JSON file, `<app>-<image id>.cdx.json`, for a
tool that keeps an inventory of what runs, or one that checks licenses. It is
read as a scan reads the image - on the same node, with the same volume - and
takes a few seconds; it is not kept. Only an image the app runs now has one.

## A project's Security tab

The project's **Security** tab lists its apps and what their images carry, the
worst first: how many **CRITICAL** and **HIGH** vulnerabilities, how many of
them have a fix, and when they were last scanned. Each opens the app's Security
tab. It is for a project's members, who cannot open System: they see the apps
they may read. While scanning is off, the tab says so, and still lists what the
last scans found.

## Setting a vulnerability aside

A vulnerability does not always apply: the package is in the image, but the code
that has it never runs, or never gets the input that triggers it. **Ignore…** on
its row sets it aside:

- **For**: this app, its environment, its project, or every project. An ignore
  of a project or an environment applies to every app in it.
- **Package**: only in this package, or in any.
- **Reason**: why it does not apply. It is required, and shown to whoever looks
  next.
- **Expires after**: 30 days to a year, or never. An expired ignore stops
  applying by itself.

An ignored vulnerability leaves the counts, the badge and the daily report. It
needs no new scan, and removing it - **Remove** under **Ignored** - counts it
again at once.

An ignore goes with an [export](../administration/export-and-import.md) of its
scope - the app, its environment, its project, or the whole installation for
one of every project - with its reason, who wrote it and its end date, and an
import brings it back. One that has expired stays behind.

## Switching it on

In **System → Image Scanning → Configuration**, check **Enabled**, choose the
**Data volume**, and save. Each scan is then a container of Trivy's image,
started for it and removed when it ends: nothing runs between scans. It runs
under the **CPU limit** and **Memory limit** set here, 1 core and 512mb by
default.

Trivy keeps on the volume, in a directory `hivepaas/scanning/trivy`, its
vulnerability database (about 1.5 GB, renewed by the first scan after each
upstream rebuild), its Java database (about 1.4 GB, fetched by the first scan
of an image with Java libraries and renewed every week) and what it has
analyzed, so an image scanned before is scanned again in under a second. The
volume can be changed at any time: the next scan fetches the databases again.
A Tmpfs volume is refused, as it is emptied after every scan. A volume in use
cannot be deleted while scanning is on.

### Where scans run

The volume decides where scans run, as it decides where an app that stores its
data on it runs:

| The volume                                | Scans run                                                            |
| ----------------------------------------- | -------------------------------------------------------------------- |
| On a node, or **Current node**            | on that node                                                         |
| **By node label**                         | on a node carrying the label: the one running the image, if one does |
| **All nodes (shared storage)**, as on NFS | on the node running each image                                       |

A scan on the node that runs the image reads it from that node's Docker. A scan
on another node reads it from its registry, by its digest, so it is exactly
what runs; with the credentials the app pulls its image with. An image that is
on its node only and in no registry - loaded there by hand - cannot be read
elsewhere: its scan says so. In a cluster of one node, or with a shared volume,
every image is read where it runs.

Scans on the same volume run one at a time: Trivy's cache is opened by one at a
time.

The page shows the volume, where scans run, and how old the database of the
last scan is. **Apps** lists every scanned app and what its images carry;
**Actions** runs the daily scan now.

The daily scan's schedule and notification are set on the same page. Its
notification is sent only when the scan found something new: an app that runs a
fixable CRITICAL or HIGH vulnerability it did not run at the last report.

Switching it off scans nothing more. What the scans found stays on the apps'
Security tabs, and the volume keeps Trivy's data.

## HivePaaS's own images

The daily scan also scans the images HivePaaS itself runs: the app, the agent,
the database, Redis and Traefik, and the registry, the logging backend, the log
collector and OBI when they run. Trivy's own image is not: it runs only while it
scans.

**System → Image Scanning → HivePaaS** lists them, each with its image and what
it carries; a row opens its vulnerabilities, as an app's Security tab shows
them. They are fixed by [upgrading HivePaaS](../installation/upgrade.md), not by
anything you rebuild, so they are in no app's counts, not in **Needs
attention**, and not in the daily notification. The tab says when a newer
release is out.

**Ignore…** there sets a vulnerability aside for every project's apps too, or
for HivePaaS's images only. An ignore of every project set from an app's tab
applies to HivePaaS's images as well.

## From an assistant or a script

- [The MCP server](../integrations/mcp-server.md) lets an AI assistant read an
  app's vulnerabilities - by default those CRITICAL and HIGH with a fix - and,
  with a key that may write, scan its images now.
- [The CLI](../cli/commands/app.md#hivepaas-app-vulns)'s `hivepaas app vulns`
  lists them, and `--fail-on` fails a CI job on what it finds:

  ```bash
  hivepaas deploy && hivepaas app scan --wait --fail-on critical
  ```

### Without access to the internet

Trivy fetches its databases from `mirror.gcr.io`. An installation that cannot
reach it can fetch them from a registry it reaches, such as
[the registry HivePaaS runs](../administration/system-settings.md#registry):
copy `aquasec/trivy-db:2` and `aquasec/trivy-java-db:1` there with `oras`, as
Trivy's [guide to air-gapped environments](https://trivy.dev/latest/docs/advanced/air-gap/)
shows, then set **DB repository** and **Java DB repository** to the copies,
such as `registry.example.com/aquasec/trivy-db:2`. Copy them again every day or
two: the database is rebuilt every 6 hours.
