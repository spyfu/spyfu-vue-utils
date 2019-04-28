import componentTimeout from './component_timeout';
import bezierEasing from 'bezier-easing';

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
export default function componentEase(vm, fn, ms, curve = [0.77, 0, 0.175, 1], steps = 0) {
    // calculate the easing curve, and create an array
    // to hold all of the timeouts we're about make
    const easing = bezierEasing(...curve);
    const frames = steps > 0 ? steps : 60 * (ms / 1000);
    const timeouts = [];

    // queue up each frame of the animation
    for (let i = 0, end = frames - 1; i <= end; i += 1) {
        const frame = i / end;

        timeouts.push(
            componentTimeout(vm, () => fn(+easing(frame).toFixed(4), i), frame * ms)
        );
    }

    // and finally, return an object we can use to cancel the timeouts
    return {
        cancel: () => timeouts.forEach(timeout => timeout.cancel()),
    };
}