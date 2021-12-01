const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { dependencies } = require('./package.json');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        main: ['./js/app.js'],
        preload: ['./index.js']
    },
    output: {
        path: path.join(process.cwd(), 'OutputApp'),
        libraryTarget: 'commonjs2',
        filename: './[name].js'
    },
    node: {
        fs: 'empty',
        __dirname: false
    },
    optimization: {
        runtimeChunk: false,
        minimize: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
// Extract and save the final CSS.
                    {loader:'mini-css-extract-plugin'},
// Load the CSS, set url = false to prevent following urls to fonts and images.
                    { loader: "css-loader", options: { url: false, importLoaders: 1 } },
// Add browser prefixes and minify CSS.
//                     { loader: 'postcss-loader', options: { plugins: [autoprefixer(), cssnano()] }},
// Load the SCSS/SASS
                    { loader: 'sass-loader' },
                ],
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    externals: [
        ...Object.keys(dependencies || {})
    ],
    target: 'electron-main'
};