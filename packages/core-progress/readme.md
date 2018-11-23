# Core Progress

## `@nrk/core-progress` enhances any tag with content to be scrollable with mouse interaction on non-touch-devices. `core-scroll` also hides the scrollbars and automatically disables animation for users who prefers [reduced motion](https://css-tricks.com/introduction-reduced-motion-media-query/).

---

## Installation

```bash
npm install @nrk/core-progress --save-exact
```
```js
import coreProgress from '@nrk/core-progress'     // Vanilla JS
import coreProgress from '@nrk/core-progress/jsx' // ...or React/Preact compatible JSX
```

---

<!--demo
<script src="core-progress/core-progress.min.js"></script>
<script src="core-progress/core-progress.jsx.js"></script>
<style>

</style>
demo-->

## Demo

```html
<!--demo-->
<label>Progress: Feilet
  <progress class="my-progress" max="100"></progress>
</label>
<script>
  coreProgress('.my-progress', 'Laster...');
  // coreProgress('.my-progress', 20);
  // coreProgress('.my-progress', { value: 20 });
  // coreProgress('.my-progress', { value: 20, max: 100 });
  coreProgress('.my-progress', { max: 100 });
</script>
```
