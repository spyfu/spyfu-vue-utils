import Vue from 'vue';
import { bindExternalEvent } from '../src/index';

test('bindExternalEvent', () => {
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
