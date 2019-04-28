import Vue from 'vue';
import { componentEase } from '../src/index';

describe('componentEase', () => {
    const linear = [0, 0, 1, 1];

    it('executes an easing transition with a given number of frames', done => {
        const fn = jest.fn();

        new Vue({
            created() {
                componentEase(this, fn, 1000, linear, 5);
            },
        });

        setTimeout(() => {
            expect(fn.mock.calls.length).toEqual(5);
            expect(fn.mock.calls[0][0]).toEqual(0);
            expect(fn.mock.calls[1][0]).toEqual(0.25);
            expect(fn.mock.calls[2][0]).toEqual(0.5);
            expect(fn.mock.calls[3][0]).toEqual(0.75);
            expect(fn.mock.calls[4][0]).toEqual(1);

            done();
        }, 1100);
    });

    it('executes at 60 fps if no framecount is provided', done => {
        const fn = jest.fn();

        new Vue({
            created() {
                componentEase(this, fn, 1000);
            },
        });

        setTimeout(() => {
            expect(fn.mock.calls.length).toEqual(60);
            done();
        }, 1100);
    });

    it('returns a hook to cancel the transition', done => {
        const fn = jest.fn();

        new Vue({
            created() {
                const timeouts = componentEase(this, fn, 1000);

                timeouts.cancel();
            },
        });

        setTimeout(() => {
            expect(fn.mock.calls.length).toEqual(0);
            done();
        }, 1100);
    });

    it('cancels callbacks if component is destroyed', done => {
        const fn = jest.fn();

        new Vue({
            created() {
                componentEase(this, fn, 1000);
                this.$destroy();
            },
        });

        setTimeout(() => {
            expect(fn.mock.calls.length).toEqual(0);
            done();
        }, 1100);
    });
});