---
sidebar_position: 5
description: 'The hivepaas CLI in scripts: JSON output, questions, exit codes, and any API call.'
---

# Scripting

## Output

`-o json` or `-o yaml` prints what a command shows, as the API gives it, for a
script to read:

```bash
hivepaas ps -o json
hivepaas deploy ls -o yaml
```

`hivepaas logs -o json` prints each line as a JSON object of its own.

## Questions

A command that deletes, restores or creates many things at once -
`app delete`, `backup restore`, `compose up` - asks first at a terminal. In a
script there is no one to ask: `--yes` answers, and without it the command
stops with exit code 2.

## Exit codes

| Code | Meaning                                            |
| ---- | -------------------------------------------------- |
| 0    | done                                               |
| 1    | failed, or `status --fail` found something         |
| 2    | wrong usage, or a question with no terminal to ask |
| 3    | the key is not accepted                            |
| 4    | the key may not do this                            |
| 5    | not found                                          |
| 6    | refused by the installation's checks               |
| 7    | the installation failed                            |
| 8    | a deployment, task or job run that failed          |
| 9    | timed out waiting                                  |
| 10   | the installation's API is newer: update the CLI    |
| 130  | interrupted                                        |

## Any API call

`hivepaas api` calls any endpoint of the [REST API](../integrations/rest-api.md)
with the CLI's key. `{project}`, `{env}` and `{app}` in the path are filled in
from the flags or the directory's link:

```bash
hivepaas api GET /projects/{project}/{env}/apps/{app}/routing-settings
hivepaas api PUT /projects/{project}/{env}/apps/{app}/health-check-settings -d @health.json
```
