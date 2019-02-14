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

export { bindExternalEvent };
//# sourceMappingURL=spyfu-vue-utils.esm.js.map
