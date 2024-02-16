const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
  },
  mode: "development",
  output: {
    filename: "[name].[contenthash].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: "source-map",
  devServer: {
    static: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [{loader: MiniCssExtractPlugin.loader}, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      filename: "index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "css/style.css"
    })
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 1
    },
  },
};
