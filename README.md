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

### bindExternalEvent

Binds a listener to an element outside the scope of a component. This listener will be cleaned up when the component is destroyed.

```js
import { bindExternalEvent } from 'spyfu-vue-utils';

new Vue({
    created() {
        bindExternalEvent(this, document.body, 'click', this.onClick);
    },
    methods: {
        onClick(e) {
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

Executes a function after a specified amount of time.

```js
import { componentTimeout } from 'spyfu-vue-utils';

new Vue({
    created() {
        componentTimeout(this, this.foo, 50);
    },
    methods: {
        foo() {
            // this will fire after 50ms if the component has not been destroyed
        },
    },
});
```

### License

[MIT](https://github.com/spyfu/spyfu-vue-utils/blob/master/LICENSE)

Copyright (c) 2019-present, SpyFu
