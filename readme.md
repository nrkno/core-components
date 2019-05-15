# Core Components

> `@nrk/core-components` is a kit of lightweight, unstyled and accessible [Javascript](https://stackoverflow.com/questions/20435653/what-is-vanillajs) and [React](https://reactjs.org/) / [Preact](https://github.com/developit/preact-compat) components.
It provides effortless and flexible usage, while under the hood enhancing markup and functionality for best best user experience across all major browsers and screen readers.

## Documentation
https://static.nrk.no/core-components/latest/


## Installation

All components are provided as [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) and React components. They are installed individually.

### Using NPM

Using NPM provides own element namespace and extensibility. Recommended:

```bash
npm install @nrk/core-dialog
```

### Using static

Using static registers the custom element with its default tag name automatically:

```html
<script src="https://static.nrk.no/core-components/major/5/core-dialog/core-dialog.min.js"></script>
```


## Usage

### HTML / JavaScript

```js
import CoreDialog from '@nrk/core-dialog'                 // Using NPM
window.customElements.define('core-dialog', CoreDialog)   // Using NPM
```

```html
<core-dialog modal hidden>...</core-dialog>
```

### React / Preact

```js
import CoreDialog from '@nrk/core-dialog/jsx'

<CoreDialog modal hidden>...</CoreDialog>
```

For more info, refer to the [documentation](https://static.nrk.no/core-components/latest/).


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
