const typescript = require('rollup-plugin-typescript2');
const html2 = require('rollup-plugin-html2');
const resolve = require('@rollup/plugin-node-resolve');
const html = require('rollup-plugin-html');
const cjs = require('@rollup/plugin-commonjs');
const eslint = require('rollup-plugin-eslint');

module.exports = {
    input: 'demo/main.ts',
    output: {
        dir: 'dist',
        format: 'cjs'
    },
    plugins: [
        resolve.default({
            browser: true
        }),
        html({
            include: '**/*.html'
        }),
        eslint.eslint({
            // configFile: './demo/.eslintrc'
        }),
        typescript({
            tsconfig: './tsconfig.json',
            clean: true
        }),
        cjs(),
        html2({
            template: './demo/index.html'
        })
    ],
};
