module.exports = (config) => {
    config.set({
        frameworks: ['jasmine', 'karma-typescript'],
        files: [{pattern: 'src/**/*.ts'}, {pattern: 'test/**/*.ts'}],
        preprocessors: {
            '**/*.ts': ['karma-typescript']
        },
        karmaTypescriptConfig: {
            compilerOptions: {
                target: 'ESNext'
            },
            coverageOptions: {
                threshold: {
                    file: {
                        statements: 100,
                        branches: 100,
                        functions: 100,
                        lines: 100,
                        overrides: {
                            'src/core/runtime.ts': {
                                statements: 90,
                                branches: 90,
                                functions: 90,
                                lines: 90
                            }
                        }
                    }
                }
            }
        },
        reporters: ['spec', 'karma-typescript'],
        browsers: ['ChromeHeadless'],
        singleRun: true
    });
};
