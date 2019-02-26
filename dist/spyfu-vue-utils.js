(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global['spyfu-vue-utils'] = {}));
}(this, function (exports) { 'use strict';

    /**
     * Bind an event to an element outside the scope of a Vue component.
     *
     * @param {Vue}         vm          vue component managing the event
     * @param {HTMLElement} targetEl    html element to bind an event listener to
     * @param  {...any}     args        all other event arguments 
     */
    function bindExternalEvent(vm, targetEl) {
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      targetEl.addEventListener.apply(targetEl, args);
      vm.$on('hook:destroyed', function () {
        targetEl.removeEventListener.apply(targetEl, args);
      });
    }

    /**
     * Create an interval that is cleaned up when the component is destroyed.
     * 
     * @param  {Vue}        vm
     * @param  {Function}   callback
     * @param  {Number}     ms
     * @return {Function}
     */
    function componentInterval(vm, callback, ms) {
      var interval = setInterval(callback, ms);

      var cancel = function cancel() {
        return clearInterval(interval);
      };

      vm.$once('hook:destroyed', cancel);
      return {
        cancel: cancel
      };
    }

    var timeouts = [];
    /**
     * Bind setTimeout() call to a component.
     *
     * @param {Vue}         vm          component managing the timeout
     * @param {Function}    callback    function to execute
     * @param {Number}      md          timeout duration in milliseconds
     */

    function componentTimeout(vm, callback, ms) {
      // track which timeouts are bound to our component, and when that
      // it is destroyed make sure to cancel any lingering timeouts
      var componentTimeouts = timeouts.find(function (obj) {
        return obj.vm === vm;
      });

      if (!componentTimeouts) {
        componentTimeouts = {
          vm: vm,
          timeouts: []
        };
        timeouts.push(componentTimeouts);
        vm.$once('hook:destroyed', function () {
          componentTimeouts.timeouts.forEach(clearTimeout);
          timeouts = timeouts.filter(function (obj) {
            return obj.vm !== vm;
          });
        });
      } // once a timeout has been executed or canceled, remove it
      // from our componentTimeouts that need to be cleaned up


      function removeTimeoutById(timeoutId) {
        if (componentTimeouts) {
          var index = componentTimeouts.timeouts.findIndex(function (pendingId) {
            return pendingId === timeoutId;
          });

          if (index > -1) {
            componentTimeouts.timeouts.splice(index, 1);
          }
        }
      } // queue the timeout, and keep track of it so it can be cleaned up
      // if the component is destroyed before this timeout is executed.


      var id = setTimeout(function () {
        callback();
        removeTimeoutById(id);
      }, ms);
      componentTimeouts.timeouts.push(id); // return a function to manually cancel up a timeout

      return {
        cancel: function cancel() {
          clearTimeout(id);
          removeTimeoutById(id);
        }
      };
    }

    var plugin = {
      install: function install(Vue) {
        Vue.prototype.$bindExternalEvent = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return bindExternalEvent.apply(void 0, [this].concat(args));
        };

        Vue.prototype.$interval = function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return componentInterval.apply(void 0, [this].concat(args));
        };

        Vue.prototype.$timeout = function () {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return componentTimeout.apply(void 0, [this].concat(args));
        };
      }
    };

    exports.SpyfuVueUtils = plugin;
    exports.bindExternalEvent = bindExternalEvent;
    exports.componentInterval = componentInterval;
    exports.componentTimeout = componentTimeout;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=spyfu-vue-utils.js.map
