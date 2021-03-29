const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: [
            // needed for IE11
            // 'core-js/stable',
            // '@webcomponents/webcomponentsjs/webcomponents-bundle.js',
            // needed for normal browser with target: es5
            // '@webcomponents/webcomponentsjs/custom-elements-es5-adapter',
            // application entry file
            './demo/main.ts'
        ]
    },
    // devtool: 'inline-source-map',
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
        filename: 'main.js',
        path: path.resolve(process.cwd(), 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './demo/index.html'
        })
    ],
    target: ['web', 'es5']
};
