# Core Components

> `@nrk/core-components` is a kit of lightweight, unstyled and accessible [Javascript](https://stackoverflow.com/questions/20435653/what-is-vanillajs) and [React](https://reactjs.org/) / [Preact](https://github.com/developit/preact-compat) components.
It provides effortless and flexible usage, while under the hood enhancing markup and functionality for best best user experience across all major browsers and screen readers.

## Documentation
https://static.nrk.no/core-components/latest/

## Installation

Components are individually installed for individual versioning:

```bash
npm install @nrk/core-toggle
```

### Using NPM

```js
import coreToggle from '@nrk/core-toggle'     // Vanilla JS
import CoreToggle from '@nrk/core-toggle/jsx' // ...or React/Preact compatible JSX
```
### Using static

Recommended only for prototyping.

```html
<script src="https://static.nrk.no/core-components/major/5/core-toggle/core-toggle.min.js"></script>
```

## Local development
First clone `@nrk/core-components` and install its dependencies:

```bash
git clone git@github.com:nrkno/core-components.git
cd core-components
npm install # Installs dependencies for all packages
npm start # Your browser will open documentation with hot reloading
```

## Building and committing
After having applied changes, remember to build before pushing the changes upstream.

```bash
git checkout -b feature/my-changes
# update the source code
npm run build # Builds all the packages
git commit -am "Add my changes"
git push origin feature/my-changes
# then make a PR to the master branch,
# and assign another developer to review your code
```

## Publishing

```bash
npm run publish:minor -- --core-input --core-toggle # Specify packages to publish
```

> NOTE! Please also make sure to keep commits small and clean (that the commit message actually refers to the updated files).  
> Stylistically, make sure the commit message is **Capitalized** and **starts with a verb in the present tense** (for example `Add minification support`).
