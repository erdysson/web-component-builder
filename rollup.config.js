const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const typescript2 = require('rollup-plugin-typescript2');
const bundleSize = require('rollup-plugin-bundle-size');
const typescript = require('typescript');
const pkg = require('./package.json');

module.exports = {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs'
        },
        {
            file: pkg.module,
            format: 'es'
        }
    ],
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
        bundleSize()
    ]
};
