const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/' // Important for Phaser asset loading
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
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
                    filename: 'assets/[name][ext]' // Organizes assets in an assets folder
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './src/favicon.ico' // If you have one
        })
    ],
    // Add Phaser-specific configuration
    resolve: {
        fallback: {
            "fs": false,
            "path": false,
            "crypto": false
        }
    }
};