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

export { bindExternalEvent, componentTimeout };
//# sourceMappingURL=spyfu-vue-utils.esm.js.map
