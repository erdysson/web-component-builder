const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const typescript2 = require('rollup-plugin-typescript2');
const babel = require('@rollup/plugin-babel').babel;
const bundleSize = require('rollup-plugin-bundle-size');
const typescript = require('typescript');
const pkg = require('./package.json');

module.exports = [
    // default version
    {
        input: 'src/index.ts',
        output: {
            file: pkg.main,
            format: 'cjs'
        },
        external: [...Object.keys(pkg.peerDependencies || {})],
        plugins: [
            // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
            commonjs(),
            // Allow node_modules resolution, so you can use 'external' to control
            // which external modules to include in the bundle
            resolve(),
            typescript2({
                typescript,
                tsconfig: 'src/tsconfig.json'
            }),
            // babel plugin to add extras
            babel({
                babelrc: true,
                babelHelpers: 'runtime',
                extensions: ['.ts'],
                exclude: '**/node_modules/**'
            }),
            bundleSize()
        ]
    },
    // modern version
    {
        input: 'src/index.ts',
        output: {
            file: pkg.module,
            format: 'es'
        },
        external: [...Object.keys(pkg.peerDependencies || {})],
        plugins: [
            // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
            commonjs(),
            // Allow node_modules resolution, so you can use 'external' to control
            // which external modules to include in the bundle
            resolve(),
            typescript2({
                typescript,
                tsconfig: 'src/tsconfig.json'
            }),
            // babel plugin to add extras
            bundleSize()
        ]
    }
];
