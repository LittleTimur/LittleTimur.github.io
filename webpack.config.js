const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

// Определяем режим (development/production)
const isDevelopment = process.env.NODE_ENV !== 'production';
// Имя репозитория для GitHub Pages (замените на своё)
const repoName = 'LittleTimur.github.io';

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: isDevelopment ? '/' : `/${repoName}/`, // Критически важно для GitHub Pages!
        assetModuleFilename: 'assets/[name][ext]'
    },
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            isDevelopment && require.resolve('react-refresh/babel')
                        ].filter(Boolean),
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.hbs|html$/,
                loader: 'handlebars-loader'
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html"
        }),
        isDevelopment && new ReactRefreshWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: "./src/img",
                    to: "img",
                    noErrorOnMissing: true
                }
            ]
        })
    ].filter(Boolean),
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, 'dist'),
            publicPath: '/'
        },
        port: 5000,
        open: true,
        hot: true
    }
};
