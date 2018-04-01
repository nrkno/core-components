---
name: Core Components
category: Introduction
---

<link rel="stylesheet" href="docs.css">

> `@nrk/core-components` is a kit of lightweight, unstyled and accessible [Javascript](https://stackoverflow.com/questions/20435653/what-is-vanillajs) and [React](https://reactjs.org/) / [Preact](https://github.com/developit/preact-compat) components.
It provides effortless and flexible usage, while under the hood enhancing markup and functionality for best best user experience across all major browsers and screen readers.

<a class="nrk-button" href="https://github.com/nrkno/core-components">View on Github</a>
<a class="nrk-button" href="https://github.com/nrkno/core-components/releases/latest">View latest release</a>

## Use from NPM
```bash
npm install @nrk/core-toggle --save         # Individual installation for individual versioning
```
```js
import coreToggle from '@nrk/core-toggle'   // Vanilla JS
import Toggle from '@nrk/core-toggle/jsx'   // ...or React/Preact compatible JSX
```

## FAQ
<details>
<summary>Why another component kit?</summary>
Despite [well documented accessibility specifications](https://www.w3.org/TR/wai-aria-practices-1.1/), best practice simply becomes unusable in several screen readers and browsers due to implementation differences. `@nrk/core-components` aims to provide the best possible good user experience regardless of browser (IE/Edge 9+, Safari, Firefox, Chrome, Opera), screen reader (MacOS/iOS: VoiceOver, Android: TalkBack , Windows: JAWS/NVDA) and other existing javascript (version conflicts and performance optimization is resolved with version bound [event delegation](https://stackoverflow.com/questions/1687296/what-is-dom-event-delegation)).
</details>
<details>
<summary>Who can I contact for requests, feedback and questions?</summary>
This is the first version of core-components - [feedback](https://github.com/nrkno/core-components/issues/)
and testing is welcome! Feel free to [submit an issue](https://github.com/nrkno/core-components/issues/)
or slack us at `#core` (NRK only)
</details>
<details>
<summary>How can I request a new components?</summary>
Please see if your [component request](https://github.com/nrkno/core-components/issues?q=is%3Aissue+is%3Aopen+Component+request) already exists, and add a +1 reaction if found. <br>For [new component requests](https://github.com/nrkno/core-components/issues/new?title=Component%20Request:%20&labels=enhancement), describe how you plan to use the components and functionality to be covered.
</details>
<details>
<summary>Where are the form elements?</summary>
HTML form elements are accessible by nature, and have quite compatible and well documented native APIs.
Best practices and styling tips is not a pure functionality concern, and therefore not covered by core-components, for now.
</details>
