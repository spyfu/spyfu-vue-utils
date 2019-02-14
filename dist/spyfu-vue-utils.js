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

    exports.bindExternalEvent = bindExternalEvent;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=spyfu-vue-utils.js.map
