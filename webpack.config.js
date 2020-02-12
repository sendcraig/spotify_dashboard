const path = require('path');
const HtmlWebpackPLugin = require('html-webpack-plugin');

const SRC_FOLDER = 'src';
const DEV_ENTRY_POINT = 'index.js';
const INDEX_HTML = 'index.html';

const base = {
    entry: path.resolve(SRC_FOLDER, DEV_ENTRY_POINT),
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
        ]
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve(__dirname, SRC_FOLDER),
        compress: true,
        hot: true,
        port: 7000,
    },
    plugins: [
        new HtmlWebpackPLugin({
            template: path.resolve(SRC_FOLDER, INDEX_HTML),
        }),
    ]
};

module.exports = base;