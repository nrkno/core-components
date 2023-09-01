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


## Testing with Playwright

Tests in this project are written using Playwright and are executed against major browser engines including Chromium, WebKit, and Firefox.

### Local Testing

To run tests from the command line, use the following npm command:

```sh
npm run test
```

You can enhance your testing experience in VSCode by using the [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright).

For added convenience, consider using the following VSCode extensions:

* [Playwright Snippets](https://marketplace.visualstudio.com/items?itemName=nitayneeman.playwright-snippets): Provides useful code snippets for Playwright.
* [Playwright Test Snippets](https://marketplace.visualstudio.com/items?itemName=mskelton.playwright-test-snippets): Offers additional code snippets specifically tailored for Playwright testing.

### Continous Integration

The GitHub Actions workflow has been configured to automatically execute Playwright tests in response to changes being pushed to the main or master branches, as well as when new pull requests are created.

Additionally, it generates test reports and summaries, which are made available as artifacts for the purpose of reviewing and analyzing the test results. Artifacts have a retention period of 30 days.


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
