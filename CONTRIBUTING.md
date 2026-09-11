# Contributing to Linguae

Thank you for taking the time. Linguae is a small personal project, so the process is deliberately
light.

## Report a bug

Open an [issue](https://github.com/martonpaulo/linguae/issues) and include what you did, what you
expected, what happened, and the browser you used. A language code or a filter combination that
reproduces it is the fastest thing you can give.

If the problem is a **wrong or missing language record**, note that the catalogue is a build-time
copy of the [Wikitongues](https://wikitongues.org/) dataset. Linguae can fix how a record is
projected or displayed; it cannot fix the source data.

Never paste an Airtable token, or any other credential, into an issue.

## Propose a change

Open an issue describing the problem before writing code, especially for anything that changes the
data contract, the snapshot shape, or the published fields. [`docs/product.md`](docs/product.md)
records the scope and the non-goals, and [`AGENTS.md`](AGENTS.md) records the working agreements the
repository follows.

## Branches, commits and pull requests

- The owner commits directly to `main`. Outside contributors work on a branch and open a pull
  request.
- Commit subjects follow [Conventional Commits](https://www.conventionalcommits.org/) in English:
  `feat`, `fix`, `refactor`, `test`, `docs`, `build`, `chore`, `ci`.
- One commit per subject. A commit made for an issue ends with `(#<issue number>)`.
- No force pushes.

## Run the validation gate

One command, running everything CI runs, in order:

```bash
npm ci
npm run validate
```

That is `npm run lint`, `npx tsc --noEmit --incremental false` and `npm test`. The acceptance suite
generates the fixture snapshot and builds the static export itself, through Playwright's web
server.

`npm test` drives the real static export in Chromium, Gecko and WebKit; `npm run test:chromium` is
the faster loop while iterating. No Airtable credentials are needed — the fixture snapshot stands in
for the real dataset.

## Code of conduct

Be respectful and assume good faith. Behaviour that makes the project unpleasant for others is not
welcome, whatever its technical merit.
