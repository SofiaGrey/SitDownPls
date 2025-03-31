const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isDev ? 'development' : 'production',
	entry: {
		main: './src/styles/main.scss',
	},
  output: {
		path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
  },
	performance: {
    maxAssetSize: 550000,
    maxEntrypointSize: 550000,
    hints: 'warning',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  optimization: {
    minimize: !isDev,
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ['imagemin-mozjpeg', { quality: isDev ? 90 : 75 }],
              ['imagemin-pngquant', { quality: isDev ? [0.8, 0.9] : [0.65, 0.8] }],
            ],
          },
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html', 
      chunks: ['main', 'media'], 
      minify: isDev
        ? false
        : {
            collapseWhitespace: true,
            removeComments: true,
          },
    }),
    new HtmlWebpackPlugin({
      template: './src/product.html',
      filename: 'product.html',
      chunks: ['main', 'product', 'media'],
      minify: isDev
        ? false
        : {
            collapseWhitespace: true,
            removeComments: true,
          },
    }),
    new HtmlWebpackPlugin({
      template: './src/catalog.html',
      filename: 'catalog.html',
      chunks: ['main', 'catalog', 'media'], 
      minify: isDev
        ? false
        : {
            collapseWhitespace: true,
            removeComments: true,
          },
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 3000,
    open: true,
    hot: true,
  },
  devtool: isDev ? 'source-map' : false,
};
