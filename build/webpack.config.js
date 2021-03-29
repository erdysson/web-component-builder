const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        // polyfills
        polyfills: './demo/polyfills.ts',
        // application entry file
        main: './demo/main.ts'
    },
    // devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(process.cwd(), 'dist'),
        compress: true,
        port: 9000
    },
    mode: 'development',
    cache: false,
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-typescript',
                                [
                                    '@babel/preset-env',
                                    {
                                        corejs: {version: 3},
                                        useBuiltIns: 'usage'
                                    }
                                ]
                            ],
                            plugins: [
                                '@babel/transform-runtime'
                            ]
                        }
                    },
                    {
                        loader: 'ts-loader'
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.html?$/,
                use: 'html-loader',
                exclude: /node_modules/
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        path: path.resolve(process.cwd(), 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './demo/index.html'
        })
    ],
    target: ['web', 'es5']
};
