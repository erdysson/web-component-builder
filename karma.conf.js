module.exports = (config) => {
    config.set({
        frameworks: ['jasmine', 'karma-typescript'],
        files: [{pattern: 'src/**/*.ts'}, {pattern: 'test/**/*.ts'}],
        preprocessors: {
            '**/*.ts': ['karma-typescript']
        },
        reporters: ['spec', 'karma-typescript'],
        browsers: ['ChromeHeadless'],
        singleRun: true
    });
};
