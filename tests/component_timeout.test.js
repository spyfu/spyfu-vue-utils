import Vue from 'vue';
import { componentTimeout } from '../src/index';

describe('componentTimeout', () => {
    it('binds a timeout to a component', done => {
        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
        const foo = jest.fn();
        const bar = jest.fn();

        const vm = new Vue({
            created() {
                // queue up a couple timeouts at 25ms and 75ms from now
                componentTimeout(this, foo, 25);
                componentTimeout(this, bar, 75);
            },
        });

        // destroy the component between our two timeouts
        setTimeout(() => vm.$destroy(), 50);

        setTimeout(() => {
            // foo should have been called
            expect(foo).toBeCalledTimes(1);

            // bar should not be called because the component was destroyed
            expect(clearTimeoutSpy).toBeCalledTimes(1);
            expect(bar).toBeCalledTimes(0);
            done();
        }, 100);
    });

    it('returns a function to cancel the timeout', done => {
        const foo = jest.fn();

        new Vue({
            created() {
                const timeout = componentTimeout(this, foo, 100);

                setTimeout(timeout.cancel, 50);
            },
        });

        setTimeout(() => {
            expect(foo).toHaveBeenCalledTimes(0);
            done();
        }, 150);
    });
});
