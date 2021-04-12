import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
// @ts-ignore
import bundleSize from 'rollup-plugin-bundle-size';
import pkg from './package.json';

export default {
    input: 'src/lib/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: pkg.name
        },
        {
            file: pkg.module,
            format: 'es'
        }
    ],
    external: [
        ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
        // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
        commonjs(),
        // Allow node_modules resolution, so you can use 'external' to control
        // which external modules to include in the bundle
        resolve(),
        typescript({
            typescript: require('typescript'),
        }),
        bundleSize()
    ]
};
