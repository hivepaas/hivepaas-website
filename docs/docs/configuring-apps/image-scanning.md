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
HivePaaS's own apps are not scanned.

## The Security tab

The app's **Security** tab shows:

- the image, its platform and its OS - with a warning when the OS is past its
  support, as its packages get no more fixes;
- how many vulnerabilities of each severity it carries, and how many have a fix;
- the vulnerabilities, the worst first: the package, the version installed and
  the version that fixes it. **Fixable only** is on by default;
- **Ignored**: those set aside, with why, by whom and until when.

The app's header shows a red badge with the number of fixable **CRITICAL**
vulnerabilities, or an amber one for fixable **HIGH** ones when there is no
CRITICAL. **Home → Needs attention** lists every app with a fixable CRITICAL
vulnerability.

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

## Switching it on

In **System → Image Scanning → Configuration**, check **Enabled** and save.
HivePaaS then runs:

- **Trivy's server**, which holds the vulnerability database: about 1.4 GB on
  disk, fetched in under a minute, and renewed by itself every hour;
- **a runner on every node**, which reads the images of its node and asks the
  server. It runs the scans of its node one at a time, under the **CPU limit**
  and **Memory limit** set here (1 core and 512mb by default).

A node that runs an image with Java libraries also fetches Trivy's Java
database once, about 1 GB, and renews it every week.

The page shows whether the server runs, on how many nodes the runners run, and
how old the database of the last scan is. **Apps** lists every scanned app and
what its images carry; **Actions** runs the daily scan now.

The daily scan's schedule and notification are set on the same page. Its
notification is sent only when the scan found something new: an app that runs a
fixable CRITICAL or HIGH vulnerability it did not run at the last report.

Switching it off removes the server and the runners. What the scans found stays
on the apps' Security tabs.

### Without access to the internet

Trivy fetches its databases from `mirror.gcr.io`. An installation that cannot
reach it can fetch them from a registry it reaches, such as
[the registry HivePaaS runs](../administration/system-settings.md#registry):
copy `aquasec/trivy-db:2` and `aquasec/trivy-java-db:1` there with `oras`, as
Trivy's [guide to air-gapped environments](https://trivy.dev/latest/docs/advanced/air-gap/)
shows, then set **DB repository** and **Java DB repository** to the copies,
such as `registry.example.com/aquasec/trivy-db:2`. Copy them again every day or
two: the database is rebuilt every 6 hours.
