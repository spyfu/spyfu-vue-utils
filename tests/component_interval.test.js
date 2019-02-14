import Vue from 'vue';
import { componentInterval } from '../src/index';

test('componentInterval', done => {
    const tick = jest.fn();

    const vm = new Vue({
        created() {
            componentInterval(this, tick, 20);
        },
    });

    // destroy our vm after 50ms
    setTimeout(() => vm.$destroy(), 50);

    setTimeout(() => {
        // tick should have been called twice
        expect(tick).toHaveBeenCalledTimes(2);
        done();
    }, 100);
});