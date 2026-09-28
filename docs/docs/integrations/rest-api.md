---
sidebar_position: 1
description: 'Calling the API: authentication, and where the reference is.'
---

# REST API

Everything the dashboard does, it does through the HivePaaS REST API, and so can
your scripts. Every endpoint is described in the [API reference](/api/hivepaas-api).

Every path is under your install's API base path, `/_`:

```bash
curl https://hivepaas.example.com/_/projects \
  -H "HIVEPAAS-API-KEY-ID: $HIVEPAAS_API_KEY_ID" \
  -H "HIVEPAAS-API-SECRET-KEY: $HIVEPAAS_API_SECRET_KEY"
```

## Authentication

A request authenticates one of two ways.

**An API key**, in the headers `HIVEPAAS-API-KEY-ID` and `HIVEPAAS-API-SECRET-KEY`.
Create one in the dashboard, among your account's settings, under API Keys. A key
acts as you, within the limits it was created with, such as whether it can make
changes. Scripts and CI use this.

**A session's access token**, in the header `Authorization: Bearer <access token>`.
A login, such as `POST /_/auth/login-with-password`, gives it. It expires within
minutes, and `POST /_/sessions/refresh` renews it. The dashboard uses this; for a
script, an API key is simpler.

A request with neither is answered `401`. The logins, the sign-up and password
reset steps, the webhooks and the public images need neither.

## Errors

A request that fails is answered with a 4xx or 5xx status and a JSON body whose
`code` names the error:

```json
{
  "status": 401,
  "code": "ERR_NO_SESSION",
  "title": "...",
  "detail": "..."
}
```
