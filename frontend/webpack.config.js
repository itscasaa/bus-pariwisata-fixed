const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.[contenthash].js',
      publicPath: '/',
      clean: true,
    },
    devtool: 'source-map',
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
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'webfonts/[name][ext]',
          }
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: './index.html',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
    ],
    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'dist'),
        },
        {
          directory: path.join(__dirname, 'public'),
          publicPath: '/',
        },
      ],
      compress: true,
      port: 3003,
      open: true,
      historyApiFallback: true,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.css'],
      conditionNames: isProduction 
        ? ['require', 'import', 'production']
        : ['require', 'import', 'development'],
      alias: {
        'react-router/dom': isProduction
          ? path.resolve(__dirname, 'node_modules/react-router/dist/production/dom-export.mjs')
          : path.resolve(__dirname, 'node_modules/react-router/dist/development/dom-export.mjs'),
        'react-router': isProduction
          ? path.resolve(__dirname, 'node_modules/react-router/dist/production/index.mjs')
          : path.resolve(__dirname, 'node_modules/react-router/dist/development/index.mjs'),
      },
    },
  };
};