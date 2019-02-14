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

      var stop = function stop() {
        return clearInterval(interval);
      };

      vm.$once('hook:destroyed', stop);
      return stop;
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
      }

      var id = setTimeout(function () {
        callback();

        if (componentTimeouts) {
          var index = componentTimeouts.timeouts.findIndex(function (pendingId) {
            return pendingId === id;
          });

          if (index > -1) {
            componentTimeouts.timeouts.splice(index, 1);
          }
        }
      }, ms);
      componentTimeouts.timeouts.push(id);
      return id;
    }

    exports.bindExternalEvent = bindExternalEvent;
    exports.componentInterval = componentInterval;
    exports.componentTimeout = componentTimeout;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=spyfu-vue-utils.js.map
