module.exports = (config) => {
    const threshold = 90;

    config.set({
        frameworks: ['jasmine', 'karma-typescript'],
        files: [{pattern: 'src/**/*.ts'}, {pattern: 'test/**/*.ts'}],
        preprocessors: {
            '**/*.ts': ['karma-typescript']
        },
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/'
        },
        karmaTypescriptConfig: {
            compilerOptions: {
                target: 'ESNext'
            },
            coverageOptions: {
                threshold: {
                    file: {
                        statements: threshold,
                        branches: threshold,
                        functions: threshold,
                        lines: threshold
                    }
                }
            }
        },
        reporters: ['spec', 'coverage', 'karma-typescript'],
        browsers: ['ChromeHeadless'],
        singleRun: true
    });
};
