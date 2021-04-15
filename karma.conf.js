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
                    // global: {
                    //     statements: 90,
                    //     branches: 90,
                    //     functions: 90,
                    //     lines: 100
                    //     // excludes: ['src/foo/**/*.js']
                    // },
                    file: {
                        statements: 100,
                        branches: 100,
                        functions: 100,
                        lines: 100
                        // excludes: ['src/bar/**/*.js'],
                        // overrides: {
                        //     'src/file.js': {
                        //         statements: 90
                        //     }
                        // }
                    }
                }
            }
        },
        reporters: ['spec', 'karma-typescript'],
        browsers: ['ChromeHeadless'],
        singleRun: true
    });
};
