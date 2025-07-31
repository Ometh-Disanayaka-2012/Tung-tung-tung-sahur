const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production', // Use 'production' for GitHub Pages
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'docs'), // GitHub Pages reads from 'docs/'
        filename: 'bundle.js',
        publicPath: './' // ✅ Crucial for GitHub Pages — uses relative path
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'docs'), // match the output folder
        },
        compress: true,
        port: 8080,
        hot: true,
        devMiddleware: {
            publicPath: '/'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|mp3|wav)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name][ext]' // Put assets in 'assets/' folder
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './src/favicon.ico' // Optional, if you have a favicon
        })
    ],
    resolve: {
        fallback: {
            fs: false,
            path: false,
            crypto: false
        }
    }
};
