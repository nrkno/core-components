# Core Components

> `@nrk/core-components` is a kit of lightweight, unstyled and accessible [Javascript](https://stackoverflow.com/questions/20435653/what-is-vanillajs) and [React](https://reactjs.org/) / [Preact](https://github.com/developit/preact-compat) components. It provides effortless and flexible usage, while under the hood enhancing markup and functionality for best best user experience across all major browsers and screen readers.



## Installation

<small>Components are individually installed for individual versioning:</small>

```bash
npm install @nrk/core-toggle --save-exact
```
```js
import coreToggle from '@nrk/core-toggle'     // Vanilla JS
import CoreToggle from '@nrk/core-toggle/jsx' // ...or React/Preact compatible JSX
```



## Motivation
Despite [well documented accessibility specifications](https://www.w3.org/TR/wai-aria-practices-1.1/), best practice simply becomes unusable in several screen readers and browsers due to implementation differences. `@nrk/core-components` aims to provide the best possible good user experience regardless of browser (IE/Edge 9+, Safari, Firefox, Chrome, Opera), screen reader (MacOS/iOS: VoiceOver, Android: TalkBack , Windows: JAWS/NVDA) and other existing javascript (version conflicts and performance optimization is resolved with version bound [event delegation](https://stackoverflow.com/questions/1687296/what-is-dom-event-delegation)).

HTML form elements are accessible by nature, and have quite compatible and well documented native APIs.
Best practices and styling tips is not a pure functionality concern, and therefore not covered by core-components, for now.
