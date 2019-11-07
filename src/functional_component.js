/**
 * Wrap a render function as a functional component.
 *
 * @param  {Function<h>}    render
 * @return {Object}
 */
export default function functionalComponent(render) {
    return {
        functional: true,
        render: render,
    };
}
