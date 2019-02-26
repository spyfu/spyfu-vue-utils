import Vue from 'vue';
import { componentInterval } from '../src/index';

describe('componentInterval', () => {
    it('binds an interval to a component', done => {
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

    it('returns a function to cancel the interval', done => {
        // create a tick function that cancels the interval
        const tick = jest.fn(vm => {
            vm.$options.interval.cancel();
        });

        // create a component and start ticking
        new Vue({
            created() {
                this.$options.interval = componentInterval(this, () => tick(this), 20);
            },
        });

        // tick should have been called once
        setTimeout(() => {
            expect(tick).toHaveBeenCalledTimes(1);

            done();
        }, 100);
    });
});