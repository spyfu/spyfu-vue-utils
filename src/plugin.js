import bindExternalEvent from './bind_external_event';
import componentEase from './component_ease';
import componentInterval from './component_interval';
import componentTimeout from './component_timeout';

export default {
    install(Vue) {
        Vue.prototype.$bindExternalEvent = function(...args) {
            return bindExternalEvent(this, ...args);
        }

        Vue.prototype.$ease = function(...args) {
            return componentEase(this, ...args);
        }

        Vue.prototype.$interval = function(...args) {
            return componentInterval(this, ...args);
        }

        Vue.prototype.$timeout = function(...args) {
            return componentTimeout(this, ...args);
        }
    },
};
