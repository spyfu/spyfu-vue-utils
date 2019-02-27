import Vue from 'vue';
import { bindExternalEvent } from '../src/index';

describe('bindExternalEvent', () => {
    it('binds an event listener to something outside the scope of a component', () => {
        const div = document.createElement('div');
        const onClick = jest.fn();

        const vm = new Vue({
            created() {
                bindExternalEvent(this, div, 'click', this.onClick);
            },
            methods: { onClick },
        });
        
        // clicking the element should hit our event handler
        div.dispatchEvent(new Event('click'));
        expect(onClick.mock.calls.length).toBe(1);

        // and clicking it again after the component is destroyed should do nothing
        vm.$destroy();
        div.dispatchEvent(new Event('click'));
        expect(onClick.mock.calls.length).toBe(1);
    });

    it('returns a function to unbind the listener', () => {
        const div = document.createElement('div');
        const onClick = jest.fn();
        
        const vm = new Vue({
            created() {
                this.$options.listener = bindExternalEvent(this, div, 'click', this.onClick);
            },
            methods: {
                onClick() {
                    onClick();
                    this.$options.listener.unbind();
                },
            },
        });

        // clicking the element should hit our event handler
        div.dispatchEvent(new Event('click'));
        expect(onClick.mock.calls.length).toBe(1);

        // since our click handler calls unbind, clicking
        // the div again should do nothing
        div.dispatchEvent(new Event('click'));
        expect(onClick.mock.calls.length).toBe(1);
    });
});
