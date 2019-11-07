import Vue from 'vue';
import { functionalComponent } from '../src/index';

describe('functionalComponent', () => {
    it('wraps a render function as a functional component', () => {
        const component = functionalComponent((h) => h('div', 'Hello world'));
        const vm = new Vue(component).$mount();

        expect(vm.$el.outerHTML).toBe('<div>Hello world</div>');
    });
});
