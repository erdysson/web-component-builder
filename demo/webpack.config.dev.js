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
            sharedConfig.moduleRules.html,
            sharedConfig.moduleRules.sass
        ]
    },
    resolve: sharedConfig.resolve,
    output: sharedConfig.output,
    optimization: sharedConfig.optimization,
    plugins: sharedConfig.plugins,
    target: 'web'
};
