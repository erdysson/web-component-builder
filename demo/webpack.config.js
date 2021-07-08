const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: process.env.TARGET_ENV === 'default' ? './app/main.umd.ts' : './app/main.esm.ts',
    mode: process.env.NODE_ENV,
    cache: false,
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './build',
        compress: false,
        port: 9000,
        inline: true,
        hot: true,
        historyApiFallback: true
    },
    resolve: {
        // webpack normally does not pick up the corresponding version based on browserslist
        // that's why, to test on IE11, this hack is needed
        mainFields: process.env.TARGET_ENV === 'default' ? ['main', 'module'] : ['module', 'main'],
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: ['babel-loader', 'ts-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.js?$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.html?$/,
                use: 'html-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(s?)css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css'
        }),
        new HtmlWebpackPlugin({
            template: './app/index.html'
        })
    ],
    output: {
        filename: '[name].[contenthash].js',
        path: path.join(process.cwd(), './build'),
        clean: true
    },
    optimization: {
        usedExports: true,
        runtimeChunk: 'single',
        moduleIds: 'deterministic',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },
    target: (() => {
        // hack for different target env
        if (process.env.TARGET_ENV === 'default') {
            // note : HMR won't work with this
            return ['web', 'es5'];
        }
        return process.env.NODE_ENV === 'development' ? 'web' : 'browserslist';
    })()
};
