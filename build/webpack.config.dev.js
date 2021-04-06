const sharedConfig = require('./shared-config');

module.exports = {
    entry: sharedConfig.entry,
    devtool: 'inline-source-map',
    mode: sharedConfig.mode,
    cache: sharedConfig.cache,
    devServer: sharedConfig.devServer,
    module: {
        rules: [
            sharedConfig.moduleRules.ts,
            sharedConfig.moduleRules.html
        ]
    },
    resolve: sharedConfig.resolve,
    output: sharedConfig.output,
    optimization: sharedConfig.optimization,
    plugins: sharedConfig.plugins,
    // 'web' needed for older browsers if passes as array, breaks the HMR
    target: 'web'
};
