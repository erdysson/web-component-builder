// eslint-disable-next-line @typescript-eslint/no-var-requires
const typescript = require('rollup-plugin-typescript2');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const babel = require('@rollup/plugin-babel');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const html2 = require('rollup-plugin-html2');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const resolve = require('@rollup/plugin-node-resolve');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const html = require('rollup-plugin-html');

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
        // babel.default({
        //     extensions: ['.js', '.ts'],
        //     babelHelpers: 'bundled',
        //     exclude: 'node_modules/**'
        // }),
        typescript({tsconfig: './tsconfig.json'}),
        html2({
            template: './demo/index.html'
        })
    ],
};
