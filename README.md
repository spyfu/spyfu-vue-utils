# spyfu-vue-utils

[![Build](https://img.shields.io/circleci/project/github/spyfu/spyfu-vue-utils/master.svg?style=flat)](https://circleci.com/gh/spyfu/spyfu-vue-utils)
[![Coverage](https://img.shields.io/codecov/c/github/spyfu/spyfu-vue-utils.svg?style=flat)](https://codecov.io/gh/spyfu/spyfu-vue-utils)
[![Dependencies](https://img.shields.io/david/dev/spyfu/spyfu-vue-utils.svg?style=flat)](https://david-dm.org/spyfu/spyfu-vue-utils?type=dev)
[![Version](https://img.shields.io/npm/v/spyfu-vue-utils.svg?style=flat)](https://www.npmjs.com/package/spyfu-vue-utils)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/spyfu/spyfu-vue-utils/blob/master/LICENSE)

Utility functions for Vue components.

- [`bindExternalEvent`](#bindexternalevent)
- [`componentEase`](#componentease)
- [`componentInterval`](#componentinterval)
- [`componentTimeout`](#componenttimeout)
- [`functionalComponent`](#functionalcomponent)

### Installation

The recommended way to install these utility functions is through a Yarn or NPM.

```bash
$ yarn add spyfu-vue-utils

# or

$ npm install spyfu-vue-utils
```

### Plugin API

In addition to importing these utilities directly, they can made available to all Vue instances by installing them as a plugin.

```js
import Vue from 'vue';
import { SpyfuVueUtils } from 'spyfu-vue-utils';

Vue.use(SpyfuVueUtils);
```

This attaches the utilities to the Vue prototype as `$bindExternalEvent`, `$interval`, and `$timeout`. The API for these functions remains the same, with the exception of not having to provide a `this` context as the first argument. As an example, here is `bindExternalEvent` being used to listen for a body click event.

```js
new Vue({
    created() {
        this.$bindExternalEvent(document.body, 'click', this.onBodyClick);
    },
    methods: {
        onBodyClick(e) {
            // ...
        },
    },
});
```

### `bindExternalEvent`

Binds a listener to something outside the scope of a component. This listener will be cleaned up when the component is destroyed. In this example, we'll bind a listener to the window scroll event. To manually stop listening for an event, call the returned `unbind` function.

```js
import { bindExternalEvent } from 'spyfu-vue-utils';

new Vue({
    created() {
        bindExternalEvent(this, window, 'scroll', this.onScroll);
    },
    methods: {
        onScroll(e) {
            // ...
        },
    },
});
```

### `componentEase`

This utility fires a function along an easing curve. It is useful when transitioning state.

```js
import { componentEase } from 'spyfu-vue-utils';

new Vue({
    created() {
        const duration = 1000;
        const easeInOutQuart = [0.77, 0, 0.175, 1]; // optional, this is the default
        const steps = 0; // optional, calculates to 60fps if zero

        // queue timeouts
        const timeouts = componentEase(this, this.fire, duration, easeInOutQuart, steps);
        
        // cancel execution
        timeouts.cancel();
    },
    methods: {
        fire(value) {
            // ...
        },
    },
});
```

### `componentInterval`

Executes a function at a given interval. The interval will be terminated when the component is destroyed, or when the returned `cancel` function is called.

```js
import { componentInterval } from 'spyfu-vue-utils';

new Vue({
    created() {
        const interval = componentInterval(this, this.tick, 100);

        // our tick function will be called every 100ms, until the component is destroyed.
        // for demo purposes though, we'll manually stop ticking after 5 seconds.
        componentTimeout(this, interval.cancel, 5000);
    },
    methods: {
        tick() {
            // ...
        },
    },
});
```

### `componentTimeout`

Executes a function after a specified amount of time. The queued function will not be executed if the component is destroyed before before the given timeout, or when the returned `cancel` function is called.

```js
import { componentTimeout } from 'spyfu-vue-utils';

new Vue({
    created() {
        const timeout = componentTimeout(this, this.fire, 5000);

        // our fire function will be called after 5 seconds, so long as the component instance
        // is still alive. for demo purposes though, we'll cancel the timeout after 2 seconds.
        componentTimeout(this, timeout.cancel, 2000);
    },
    methods: {
        fire() {
            // ...
        },
    },
});
```

### `functionalComponent`

Wraps a plain render function as a functional component object. This can be useful when storing multiple components in a single file.

> **Note:** Because this utility exists for use with functional components, it is not exposed via the plugin API.

```js
import { functionalComponent } from 'spyfu-vue-utils';

const component = functionalComponent(() => <div>Hello from a functional component!</div>);

new Vue(component);
```

### License

[MIT](https://github.com/spyfu/spyfu-vue-utils/blob/master/LICENSE)

Copyright (c) 2019-present, SpyFu
