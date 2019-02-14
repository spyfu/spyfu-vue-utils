let timeouts = [];

/**
 * Bind setTimeout() call to a component.
 *
 * @param {Vue}         vm          component managing the timeout
 * @param {Function}    callback    function to execute
 * @param {Number}      md          timeout duration in milliseconds
 */
export default function componentTimeout(vm, callback, ms) {
    let componentTimeouts = timeouts.find(obj => obj.vm === vm);

    if (!componentTimeouts) {
        componentTimeouts = { vm, timeouts: [] };

        timeouts.push(componentTimeouts);

        vm.$once('hook:destroyed', () => {
            componentTimeouts.timeouts.forEach(clearTimeout);
            timeouts = timeouts.filter(obj => obj.vm !== vm);
        });
    }

    const id = setTimeout(() => {
        callback();

        if (componentTimeouts) {
            const index = componentTimeouts.timeouts.findIndex(pendingId => pendingId === id);

            if (index > -1) {
                componentTimeouts.timeouts.splice(index, 1);
            }
        }
    }, ms);

    componentTimeouts.timeouts.push(id);

    return id;
}