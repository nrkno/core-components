# @nrk/core-components

> NRK's UI component library

[Demo and documentation](https://static.nrk.no/core-components/latest/)

## Local development
First clone `@nrk/core-components` and install its dependencies:

```bash
git clone git@github.com:nrkno/core-components.git
cd core-components
npm install # Installs dependencies for all packages
npm start   # Starts localhost:10001
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

WIP
```bash
npm run publish:minor --core-input --core-toggle # Specify packages to publish
```

> NOTE! Please also make sure to keep commits small and clean (that the commit message actually refers to the updated files).  
> Stylistically, make sure the commit message is **Capitalized** and **starts with a verb in the present tense** (for example `Add minification support`).
