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
and uses it again to start the app on another node. For Amazon ECR, create an
[Amazon ECR credential](#amazon-ecr) instead.

## Amazon ECR

Amazon ECR has no password that lasts. Its password is a token that expires
after 12 hours, and only AWS keys can get a new one. So an Amazon ECR credential
holds AWS keys: HivePaaS gets tokens from them, and renews the tokens Swarm
keeps.

### Create the credential

The AWS keys are kept in a key auth, so that one IAM key can serve the registry
and a backup bucket, and is changed in one place. First, in **Integrations →
Key Auth**, create a key auth with the IAM user's access key ID as its key ID,
and its secret access key as its secret key.

Then, in **Integrations → Registry Auth**, create a credential, and set:

- **Type**: **Amazon ECR**. The other choice, **Username and password**, is the
  credential described above.
- **Server Address**: the registry's address,
  `<account>.dkr.ecr.<region>.amazonaws.com`, such as
  `123456789012.dkr.ecr.eu-west-1.amazonaws.com`, or its dual-stack address,
  `<account>.dkr-ecr.<region>.on.aws`. HivePaaS reads the region from it, and
  takes only an Amazon ECR address: the token goes nowhere else.
- **Key Auth**: the key auth holding the IAM user's keys.
- **Role ARN**, optional: a role HivePaaS assumes with the keys, such as
  `arn:aws:iam::123456789012:role/hivepaas-pull`.

**Test Connection** gets a token with the keys, and signs in to the registry
with it.

There is no username or password to give: the username is `AWS`, and the
password is the token. The credential's page shows when its current token
expires.

An image in the registry is named with its address, such as
`123456789012.dkr.ecr.eu-west-1.amazonaws.com/web:2.4.0`.

### The IAM policy

Give HivePaaS an IAM user of its own, that can pull and nothing more:

- `ecr:GetAuthorizationToken`, on every resource (`"*"`), to get a token;
- `ecr:BatchGetImage`, `ecr:GetDownloadUrlForLayer` and
  `ecr:BatchCheckLayerAvailability`, on the repositories it pulls from.

```json title="hivepaas-ecr-pull.json"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ecr:GetAuthorizationToken",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecr:BatchGetImage",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchCheckLayerAvailability"
      ],
      "Resource": [
        "arn:aws:ecr:eu-west-1:123456789012:repository/web",
        "arn:aws:ecr:eu-west-1:123456789012:repository/api"
      ]
    }
  ]
}
```

To push the images HivePaaS builds to the registry, under
[**Registry To Push Image To**](./git-repository.md#more-than-one-node), add
`ecr:InitiateLayerUpload`, `ecr:UploadLayerPart`, `ecr:CompleteLayerUpload` and
`ecr:PutImage` to the second statement.

With a **Role ARN**, the role carries these permissions instead. The user needs
`sts:AssumeRole` on the role, and the role's trust policy must let the user
assume it.

### Token renewal

Swarm keeps the credential an app was deployed with, and pulls the image with it
again: to start the app on another node, or after its image was removed from its
node. A token kept there stops working after 12 hours. The renewal job hands
Swarm a new one before then.

Set it in **Settings → Registry Auth Renewal**:

- **Interval**: how often it runs, from 1 to 10 hours, every 6 hours by default.
  Each token it hands over lasts at least the interval and an hour more, so it
  is still good at the next run.
- **Notification Configuration**: a run that fails notifies the default
  notification target, unless you choose another.
- **Run Renewal Now**, under **Actions**, runs it at once.

A run gets a new token for each Amazon ECR credential, and gives it to the apps
that pull with it: the apps whose image uses the credential, and the apps and
functions that push their builds to it. Running containers are not restarted.

It also runs at once when the keys change - a key auth's keys edited, or a
credential linked to another key auth or role - and when HivePaaS starts after
being down for longer than the interval. A token got with keys since edited is
never handed over again.

A key auth turned off stops its credentials from getting tokens: the next run
fails, and notifies.

With the renewal turned off, the apps that use an Amazon ECR credential cannot
be started on another node, or again after their image is gone from their node,
once 12 hours have passed.

### Not supported

- Amazon ECR Public, `public.ecr.aws`.
- Keys from the host, such as an EC2 instance's role: the credential needs keys
  of its own.

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
