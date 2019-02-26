/**
 * Create an interval that is cleaned up when the component is destroyed.
 * 
 * @param  {Vue}        vm
 * @param  {Function}   callback
 * @param  {Number}     ms
 * @return {Function}
 */
export default function componentInterval(vm, callback, ms) {
    const interval = setInterval(callback, ms);

    const cancel = () => clearInterval(interval);
    
    vm.$once('hook:destroyed', cancel);

    return { cancel };
}
