let timeouts = [];

/**
 * Bind setTimeout() call to a component.
 *
 * @param {Vue}         vm          component managing the timeout
 * @param {Function}    callback    function to execute
 * @param {Number}      md          timeout duration in milliseconds
 */
export default function componentTimeout(vm, callback, ms) {
    // track which timeouts are bound to our component, and when that
    // it is destroyed make sure to cancel any lingering timeouts
    let componentTimeouts = timeouts.find(obj => obj.vm === vm);

    if (!componentTimeouts) {
        componentTimeouts = { vm, timeouts: [] };

        timeouts.push(componentTimeouts);

        vm.$once('hook:destroyed', () => {
            componentTimeouts.timeouts.forEach(clearTimeout);
            timeouts = timeouts.filter(obj => obj.vm !== vm);
        });
    }

    // once a timeout has been executed or canceled, remove it
    // from our componentTimeouts that need to be cleaned up
    function removeTimeoutById(timeoutId) {
        if (componentTimeouts) {
            const index = componentTimeouts.timeouts.findIndex(pendingId => pendingId === timeoutId);

            if (index > -1) {
                componentTimeouts.timeouts.splice(index, 1);
            }
        }
    }

    // queue the timeout, and keep track of it so it can be cleaned up
    // if the component is destroyed before this timeout is executed.
    const id = setTimeout(() => {
        callback();
        removeTimeoutById(id);
    }, ms);

    componentTimeouts.timeouts.push(id);

    // return a function to manually cancel up a timeout
    return {
        cancel: () => {
            clearTimeout(id);
            removeTimeoutById(id);
        },
    };
}