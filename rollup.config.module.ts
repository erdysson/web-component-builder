import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import scss from 'rollup-plugin-scss';
// @ts-ignore
import html from 'rollup-plugin-html';

const pkg = require('./package.json');

export default {
    input: 'src/lib/built-ins/built-in.module.ts',
    output: [
        {file: pkg.module, format: 'es', sourcemap: true}
    ],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    // watch: {
    //     include: 'src/**',
    // },
    plugins: [
        // Allow json resolution
        json(),
        html(),
        scss({
            output: 'dist/main.css'
        }),
        // Compile TypeScript files
        typescript({
            tsconfig: './tsconfig.module.json',
            useTsconfigDeclarationDir: true
        }),
        // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
        commonjs(),
        // Allow node_modules resolution, so you can use 'external' to control
        // which external modules to include in the bundle
        // https://github.com/rollup/rollup-plugin-node-resolve#usage
        resolve(),
        // Resolve source maps to the original source
        sourceMaps(),
    ],
}