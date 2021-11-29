const path = require('path');
const webpack = require('webpack');
const {dependencies} = require('../package.json');
const ElectronDevWebpackPlugin = require('electron-dev-webpack-plugin');

module.exports = {
    // 配置开发模式
    mode: 'development',
    entry: {
        // 配置入口文件
        main: path.join(__dirname, 'index.js')
    },
    // 配置出口文件
    output: {
        path: path.join(__dirname, 'OutputApp/'),
        libraryTarget: 'commonjs2',
        filename: '[name].js'
    },
    // 监听文件改变
    watch: true,
    optimization: {
        minimize: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css|.scss$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: {importLoaders: 2}},  //2代表css-loader后还需要几个loader
                    'sass-loader'
                ]
            }
            ]
    },
    externals: [
        ...Object.keys(dependencies || {})
    ],
    node: {
        __dirname: true,
        __filename: true
    },
    plugins: [
        new webpack.DefinePlugin({}),
        new ElectronDevWebpackPlugin()
    ],
    target: 'electron-main'
}