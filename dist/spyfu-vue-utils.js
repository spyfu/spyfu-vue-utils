(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('bezier-easing')) :
    typeof define === 'function' && define.amd ? define(['exports', 'bezier-easing'], factory) :
    (global = global || self, factory(global['spyfu-vue-utils'] = {}, global.bezierEasing));
}(this, function (exports, bezierEasing) { 'use strict';

    bezierEasing = bezierEasing && bezierEasing.hasOwnProperty('default') ? bezierEasing['default'] : bezierEasing;

    /**
     * Bind an event to an element outside the scope of a Vue component.
     *
     * @param {Vue}         vm          vue component managing the event
     * @param {HTMLElement} targetEl    html element to bind an event listener to
     * @param {...any}      args        all other event arguments 
     */
    function bindExternalEvent(vm, targetEl) {
      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      targetEl.addEventListener.apply(targetEl, args);

      var unbind = function unbind() {
        targetEl.removeEventListener.apply(targetEl, args);
      };

      vm.$on('hook:destroyed', unbind);
      return {
        unbind: unbind
      };
    }

    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
    }

    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

        return arr2;
      }
    }

    function _iterableToArray(iter) {
      if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
    }

    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance");
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

    /**
     * Create a component bound easing timeout.
     * 
     * @param  {Vue}            vm
     * @param  {Function}       fn
     * @param  {number}         ms
     * @param  {Array<number>}  curve
     * @param  {number}         steps
     * @return {Function}
     */

    function componentEase(vm, fn, ms) {
      var curve = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [0.77, 0, 0.175, 1];
      var steps = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      // calculate the easing curve, and create an array
      // to hold all of the timeouts we're about make
      var easing = bezierEasing.apply(void 0, _toConsumableArray(curve));
      var frames = steps > 0 ? steps : 60 * (ms / 1000);
      var timeouts = []; // queue up each frame of the animation

      var _loop = function _loop(i, end) {
        var frame = i / end;
        timeouts.push(componentTimeout(vm, function () {
          return fn(+easing(frame).toFixed(4), i);
        }, frame * ms));
      };

      for (var i = 0, end = frames - 1; i <= end; i += 1) {
        _loop(i, end);
      } // and finally, return an object we can use to cancel the timeouts


      return {
        cancel: function cancel() {
          return timeouts.forEach(function (timeout) {
            return timeout.cancel();
          });
        }
      };
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

    var plugin = {
      install: function install(Vue) {
        Vue.prototype.$bindExternalEvent = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return bindExternalEvent.apply(void 0, [this].concat(args));
        };

        Vue.prototype.$ease = function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return componentEase.apply(void 0, [this].concat(args));
        };

        Vue.prototype.$interval = function () {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return componentInterval.apply(void 0, [this].concat(args));
        };

        Vue.prototype.$timeout = function () {
          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          return componentTimeout.apply(void 0, [this].concat(args));
        };
      }
    };

    exports.SpyfuVueUtils = plugin;
    exports.bindExternalEvent = bindExternalEvent;
    exports.componentEase = componentEase;
    exports.componentInterval = componentInterval;
    exports.componentTimeout = componentTimeout;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=spyfu-vue-utils.js.map
