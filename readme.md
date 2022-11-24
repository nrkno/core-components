# @nrk/core-components

> A kit of lightweight, unstyled and accessible [Javascript](https://stackoverflow.com/questions/20435653/what-is-vanillajs) and [React](https://reactjs.org/) / [Preact](https://github.com/developit/preact-compat) components.
It provides effortless and flexible usage, while under the hood enhancing markup and functionality for best best user experience across all major browsers and screen readers.

## Documentation
https://static.nrk.no/core-components/latest/


## Local development
First clone `@nrk/core-components` and install its dependencies:

```bash
git clone git@github.com:nrkno/core-components.git
cd core-components
npm install # Installs dependencies for all packages
npm start # Your browser will open documentation with hot reloading
```


## Testing

You can run the tests locally or remotely with CrossBrowserTesting.

Run the tests locally:

```sh
npm test
```

Before running tests remotely you need a `.env` file providing credentials:

User and authkey can be found in your user profile on [crossbrowsertesting](https://app.crossbrowsertesting.com/account)

```sh
SMARTBEAR_USER=...
SMARTBEAR_AUTHKEY=...
```
Save it in the root directory.

Run tests remotely against all targeted browsers:

```sh
npm run test-remote
```

## Building and committing
After having applied changes, remember to build before pushing the changes upstream.

```bash
git checkout -b feature/my-changes
# update the source code
npm run build
git commit -am "<prefix>: Add my changes"
git push --set-upstream origin feature/my-changes
# then make PR to the master branch,
# and assign a developer to review your code
```

## Publishing

```bash
npm run publish:minor -- --core-input --core-toggle # Specify packages to publish
```

> NOTE! Please also make sure to keep commits small and clean (that the commit message actually refers to the updated files).
> Stylistically, make sure the commit message is **Capitalized** and **starts with a verb in the present tense** (for example `Add minification support`).
