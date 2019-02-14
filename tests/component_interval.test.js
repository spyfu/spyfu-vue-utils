import Vue from 'vue';
import { componentInterval } from '../src/index';

test('componentInterval', done => {
    let count = 0;

    const tick = jest.fn(vm => {
        count++;

        if (count === 2) {
            vm.$destroy();
        }
    });

    new Vue({
        created() {
            componentInterval(this, () => tick(this), 20);
        },
    });

    setTimeout(() => {
        // tick should have been called twice
        expect(tick).toHaveBeenCalledTimes(2);
        
        done();
    }, 100);
});