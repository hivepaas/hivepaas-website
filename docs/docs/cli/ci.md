---
sidebar_position: 4
description: 'Running the hivepaas CLI in a CI pipeline: installing it, its key, and a deploy.'
---

# In CI

In CI nothing is stored: instead of `login`, set `HIVEPAAS_URL` to the
installation's address and `HIVEPAAS_API_KEY` to `<key id>:<secret>`, from the
CI's secrets. Give the key only what the pipeline does: see
[CI/CD](../integrations/ci-cd.md#an-api-key).

```yaml title=".github/workflows/deploy.yml"
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-24.04
    steps:
      - name: Install the HivePaaS CLI
        run: |
          v=1.0.0-beta1
          base=https://github.com/hivepaas/hivepaas-cli/releases/download/v$v
          curl -fsSLO "$base/hivepaas_${v}_linux_amd64.tar.gz"
          curl -fsSLO "$base/checksums.txt"
          sha256sum -c --ignore-missing checksums.txt
          tar xzf "hivepaas_${v}_linux_amd64.tar.gz" hivepaas
          sudo mv hivepaas /usr/local/bin/

      - name: Deploy, and wait for it
        env:
          HIVEPAAS_URL: https://hivepaas.example.com
          HIVEPAAS_API_KEY: ${{ secrets.HIVEPAAS_API_KEY }}
        run: hivepaas deploy -p shop -e production -a api --image ghcr.io/acme/shop-api:${{ github.sha }}
```

Pin the CLI's version in CI, as above, and move it when you update the
installation.

`deploy` fails the job when the deployment fails, and waits up to 30 minutes;
`--timeout` changes that. `job run` waits for a scheduled job's run the same
way. A command that would ask at a terminal needs `--yes` here: see
[Scripting](./scripting.md).
