# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## API reference

The API reference at `/api` is generated from the backend's OpenAPI spec. The docs
keep a copy of it, `openapi/hivepaas.json`, so a build needs no network. The pages
generated from it, under `api/`, are not committed: `yarn start`, `yarn build` and
`yarn typecheck` generate them first.

To take the backend's latest spec, whenever its API changed:

```bash
yarn api:update   # downloads the spec from the backend's main branch, then regenerates the pages
```

Then check the site with `yarn start`, and commit `openapi/hivepaas.json`.

The spec can come from elsewhere:

```bash
# A backend branch or tag, such as a release's
HIVEPAAS_API_REF=release yarn api:update

# A local backend checkout, before its changes are pushed
HIVEPAAS_API_SPEC=../../hivepaas/docs/openapi/swagger.json yarn api:update
```

The spec is written by the backend's `make gen-swag`, from its handlers' comments,
so a wrong or missing description is fixed there. The descriptions are Markdown
compiled as MDX: a placeholder like `<name>` must be in backticks, or the build fails.

The scripts:

| Script            | Does                                             |
| ----------------- | ------------------------------------------------ |
| `yarn api:fetch`  | Takes the spec into `openapi/hivepaas.json`      |
| `yarn api:gen`    | Regenerates the pages under `api/` from the spec |
| `yarn api:update` | Both                                             |

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
