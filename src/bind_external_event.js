/**
 * Bind an event to an element outside the scope of a Vue component.
 *
 * @param {Vue}         vm          vue component managing the event
 * @param {HTMLElement} targetEl    html element to bind an event listener to
 * @param  {...any}     args        all other event arguments 
 */
export default function bindExternalEvent(vm, targetEl, ...args) {
    targetEl.addEventListener(...args);

    vm.$on('hook:destroyed', () => {
        targetEl.removeEventListener(...args);
    });
}
