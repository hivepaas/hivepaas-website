---
sidebar_position: 5
description: 'Knowing when an app is ready, and restarting it when it is not.'
---

# Health checks

HivePaaS has two kinds of health check:

- **the container's**, which Docker runs inside each container, to restart one
  that stopped working, and to know when a new one is ready;
- **the app's**, which HivePaaS runs from outside against a URL, to tell you
  when the app is down.

## The container's health check

In the app's **Container Settings**, under the health check, choose its **Mode**:

- **Inherit**: the image's own `HEALTHCHECK`, if it has one;
- **CMD**: a command run directly, such as `curl -f http://localhost:8080/health`;
- **CMD-SHELL**: a command run by the container's shell, such as
  `pg_isready -U "$POSTGRES_USER"`.

The command succeeds, with exit code 0, while the container is healthy. Then:

| Setting            | What it does                                                          |
| ------------------ | --------------------------------------------------------------------- |
| **Interval**       | The time between two checks.                                          |
| **Timeout**        | The longest one check may take.                                       |
| **Retries**        | How many checks in a row must fail before the container is unhealthy. |
| **Start Period**   | The time a starting container gets before failures count.             |
| **Start Interval** | The time between checks during the start period.                      |

Docker replaces a container that turns unhealthy. The command runs inside the
container, so the tool it uses, such as `curl` or `wget`, must be in the image.

## The app's health checks

In the app's **Periodic Jobs**, create a health check:

| Setting                        | What to give                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------ |
| **Type**                       | **REST** for an HTTP endpoint, or **GRPC** for a gRPC health service.          |
| **URL**, **Method**, **Body**  | The request to make, such as `GET https://shop.example.com/health`.            |
| **Return Code Must Be**        | The status codes that pass, such as `200,204`.                                 |
| **Return Body Must Be**        | Optional: text the body must equal or match, or JSON it must equal or contain. |
| **Scheduling**                 | How often to check, and the timeout, retries and delay between them.           |
| **Notification Configuration** | Who hears when it fails, and how often at most, with **Min Send Interval**.    |

When a check fails, HivePaaS notifies the target you chose. A
[scheduled job](./scheduled-jobs.md#triggers) can run when the app's health
checks fail, and when they pass again.
