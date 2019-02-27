# spyfu-vue-utils

[![Build](https://img.shields.io/circleci/project/github/spyfu/spyfu-vue-utils/master.svg?style=flat)](https://circleci.com/gh/spyfu/spyfu-vue-utils)
[![Coverage](https://img.shields.io/codecov/c/github/spyfu/spyfu-vue-utils.svg?style=flat)](https://codecov.io/gh/spyfu/spyfu-vue-utils)
[![Dependencies](https://img.shields.io/david/dev/spyfu/spyfu-vue-utils.svg?style=flat)](https://david-dm.org/spyfu/spyfu-vue-utils?type=dev)
[![Version](https://img.shields.io/npm/v/spyfu-vue-utils.svg?style=flat)](https://www.npmjs.com/package/spyfu-vue-utils)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/spyfu/spyfu-vue-utils/blob/master/LICENSE)

Utility functions for Vue components.

- [`bindExternalEvent`](#bindexternalevent)
- [`componentInterval`](#componentinterval)
- [`componentTimeout`](#componenttimeout)

### Installation

The recommended way to install these utility functions is through a Yarn or NPM.

```bash
$ yarn add spyfu-vue-utils

# or

$ npm install spyfu-vue-utils
```

Additionally, the utilities can be served via a CDN.

```html
<script src="https://raw.githubusercontent.com/spyfu/spyfu-vue-utils/master/dist/spyfu-vue-utils.min.js"></script>
```

### bindExternalEvent

Binds a listener to something outside the scope of a component. This listener will be cleaned up when the component is destroyed. In this example, we'll bind a listener to the window scroll event.

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

### componentInterval

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

### componentTimeout

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

### Plugin API

In addition to being able to import these utilities directly, they can be exposed to all Vue instances if you prefer. To do this, simply install them as a plugin.

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

### License

[MIT](https://github.com/spyfu/spyfu-vue-utils/blob/master/LICENSE)

Copyright (c) 2019-present, SpyFu
