const sharedConfig = require('./shared-config');

module.exports = {
    entry: sharedConfig.entry,
    mode: sharedConfig.mode,
    cache: sharedConfig.cache,
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
    target: sharedConfig.target
};
