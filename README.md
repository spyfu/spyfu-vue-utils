# spyfu-vue-utils

[![Build](https://img.shields.io/circleci/project/github/spyfu/spyfu-vue-utils/master.svg?style=flat)](https://circleci.com/gh/spyfu/spyfu-vue-utils)
[![Dependencies](https://img.shields.io/david/dev/spyfu/spyfu-vue-utils.svg?style=flat)](https://david-dm.org/spyfu/spyfu-vue-utils?type=dev)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/spyfu/spyfu-vue-utils/blob/master/LICENSE)

Utility function for Vue components.

### bindExternalEvent

Binds a listener to an element outside the scope of a component. This listener will be cleaned up when the component is destroyed.

```js
import { bindExternalEvent } from 'spyfu-vue-utils';

new Vue({
    created() {
        bindExternalEvent(this, document.body, this.onClick);
    },
    methods: {
        onClick(e) {
            // ...
        },
    },
});
```

### componentInterval

Executes a function at a given interval. The interval will be terminated when the component is destroyed, or when the returned stop function is called.

```js
import { componentInterval } from 'spyfu-vue-utils';

new Vue({
    created() {
        componentInterval(this, this.tick, 50);
    },
    methods: {
        tick() {
            // this will fire every 50ms until the component is destroyed
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
