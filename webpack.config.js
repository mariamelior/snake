'use strict';
const  path = require('path');

const isProduction = process.argv.some(arg => arg === '-p' || arg === '--production');

let DEVTOOL = 'hidden-source-map';

let entrys = { 'snake' : path.resolve(__dirname, 'src/index.tsx')};

const PORT = 8888;
const HOST = '0.0.0.0';
const URL = 'http://' + HOST + ':' + PORT;


let loaders = [
    {test: /\.tsx?$/, loaders: ['ts-loader']},
    {test: /\.css$/, loaders: ['style-loader', 'css-loader']},
];

const webpackBaseConfig = {
    mode: "development",
    entry: entrys,
    devtool: DEVTOOL,
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build'),
        publicPath: "/"
    },
    module: {
        rules: loaders
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
        ],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
    },

    devServer: {
        host: HOST,
        port: PORT,
        publicPath: "/",
        noInfo: false,
        stats: "errors-only",
        hot: false
    }
};

module.exports = webpackBaseConfig;
