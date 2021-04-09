const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main: './app/main.ts'
    },
    mode: process.env.NODE_ENV,
    cache: false,
    // devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        compress: false,
        port: 9000,
        inline: true,
        hot: true
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
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
            {
                test: /\.scss?$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        // Compiles Sass to CSS
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
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
        path: path.join(process.cwd(), './dist'),
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
    // target: process.env.NODE_ENV === 'development' ? 'web' : 'browserslist'
    target: 'browserslist'
};
