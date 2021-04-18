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
        external: [/@babel\/runtime/],
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
                // https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
                babelHelpers: 'runtime',
                extensions: ['.ts'],
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: pkg.browserslist.default,
                            debug: true
                        }
                    ]
                ],
                plugins: ['@babel/transform-runtime'],
                exclude: 'node_modules/**'
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
        external: [/@babel\/runtime/],
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
                // https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
                babelHelpers: 'runtime',
                extensions: ['.ts'],
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: pkg.browserslist.modern,
                            debug: true
                        }
                    ]
                ],
                plugins: ['@babel/transform-runtime'],
                exclude: 'node_modules/**'
            }),
            bundleSize()
        ]
    }
];
