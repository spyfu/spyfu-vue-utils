import babel from 'rollup-plugin-babel';
import pkg from './package.json';
import { uglify } from 'rollup-plugin-uglify';

const plugins = [
    babel({
        exclude: 'node_modules/**',
    }),
];

export default [
    // browser friendly umd build
    {
        input: 'src/index.js',
        output: {
            file: pkg.main,
            format: 'umd',
            name: 'spyfu-vue-utils',
            sourcemap: true,
        },
        plugins: plugins,
    },

    // browser friendly umd build (minified)
    {
        input: 'src/index.js',
        output: {
            file: 'dist/spyfu-vue-utils.min.js',
            format: 'umd',
            name: 'spyfu-vue-utils-min',
            sourcemap: true,
        },
        plugins: plugins.concat([
            uglify(),
        ]),
    },

    // ecmascript build
    {
        input: 'src/index.js',
        output: {
            file: pkg.module,
            format: 'esm',
            sourcemap: true,
        },
        plugins: plugins,
    },
];
