const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const entry = {
    // this is preferred way for better code splitting
    // rather than multiple entry points!
    main: [
        // polyfills necessary for browser support,
        './demo/polyfills.ts',
        // main entry point of client code
        './demo/main.ts'
    ]
};

const mode = process.env.NODE_ENV;

const devServer = {
    contentBase: path.join(process.cwd(), 'dist'),
    compress: false,
    port: 9000,
    inline: true,
    hot: true
};

const cache = true;

const moduleRules = {
    ts: {
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
    html: {
        test: /\.html?$/,
        use: 'html-loader',
        exclude: /node_modules/
    },
    sass: {
        test: /\.scss?$/,
        use: [
            MiniCssExtractPlugin.loader,
            // {
            //     // Creates `style` nodes from JS strings
            //     loader: 'style-loader'
            // },
            {
                // Translates CSS into CommonJS
                loader: 'css-loader'
            },
            {
                // Compiles Sass to CSS
                loader: 'sass-loader',
                options: {
                    sourceMap: true
                },
                // sassOptions: {
                //     outputStyle: 'compressed',
                // }
            }
        ],
        exclude: /node_modules/
    }
};

const resolve = {
    extensions: ['.ts', '.js']
};

const output = {
    filename: '[name].[contenthash].js',
    path: path.resolve(process.cwd(), 'dist'),
    clean: true
}

const optimization = {
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
};

const plugins = [
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css'
    }),
    new HtmlWebpackPlugin({
        template: './demo/index.html'
    })
]

module.exports = {
    entry,
    mode,
    cache,
    devServer,
    moduleRules,
    resolve,
    output,
    optimization,
    plugins
};
