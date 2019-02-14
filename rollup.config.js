import babel from 'rollup-plugin-babel';

const pkg = require('./package.json');

export default {
    input: 'src/index.js',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'spyfu-vue-utils',
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true,
        },
    ],
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
    ],
}
