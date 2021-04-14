const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const typescript2 = require('rollup-plugin-typescript2');
const typescript = require('typescript');
const puppeteer = require('puppeteer');

process.env.CHROME_BIN = puppeteer.executablePath();
// process.env.FIREFOX_BIN = puppeteer.executablePath();

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai', 'sinon'],
        plugins: [
            require('karma-mocha'),
            require('karma-chai'),
            require('karma-sinon'),
            require('karma-rollup-preprocessor'),
            require('karma-spec-reporter'),
            require('karma-chrome-launcher')
        ],
        files: ['test/**/*.spec.ts'],
        preprocessors: {
            '**/*.ts': ['rollup']
        },
        rollupPreprocessor: {
            plugins: [
                globals(),
                builtins(),
                resolve(),
                commonjs(),
                typescript2({
                    typescript,
                    tsconfig: 'test/tsconfig.json'
                })
            ],
            output: {
                format: 'iife',
                name: 'test',
                sourcemap: 'inline'
            }
        },
        // browsers: ['ChromeHeadless', 'FirefoxHeadless'],
        browsers: ['ChromeHeadless'],
        reporters: ['spec'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        singleRun: true,
        concurrency: Infinity,
        client: {
            captureConsole: true
        }
    });
};
